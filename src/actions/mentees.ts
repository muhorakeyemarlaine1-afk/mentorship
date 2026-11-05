"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { logAudit } from "@/lib/audit"
import { deleteProfileImage } from "@/lib/r2"
import { queueEmail } from "@/lib/mail"
import {
    accountStatusEmail,
    emailChangedEmail,
    inviteEmail,
} from "@/lib/emails"
import {
    CLEAR_PASSWORD_TOKEN,
    INVITE_TOKEN_TTL_MS,
    createPasswordToken,
} from "@/lib/password-tokens"
import {
    createMenteeSchema,
    updateMenteeSchema,
    type CreateMenteeInput,
    type UpdateMenteeInput,
} from "@/lib/validations/mentee"

export async function createMenteeAction(values: CreateMenteeInput) {
    const session = await requireAdmin()

    const parsed = createMenteeSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const existing = await prisma.user.findUnique({
        where: { email: parsed.data.email },
    })
    if (existing) {
        return { error: "A user with this email already exists." }
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

    const mentee = await prisma.user.create({
        data: {
            name: parsed.data.name,
            email: parsed.data.email,
            title: parsed.data.title || null,
            bio: parsed.data.bio || null,
            image: parsed.data.image || null,
            password: hashedPassword,
            role: "MENTEE",
            mustResetPassword: true,
        },
    })

    await logAudit(session.user, "Created mentee", "Mentee", mentee.id, mentee.email)

    queueEmail(
        mentee.email,
        inviteEmail(
            mentee.name,
            "MENTEE",
            await createPasswordToken(mentee.id, INVITE_TOKEN_TTL_MS)
        )
    )

    revalidatePath("/mentees")
    redirect(`/mentees/${mentee.id}`)
}

export async function updateMenteeAction(
    id: string,
    values: UpdateMenteeInput
) {
    const session = await requireAdmin()

    const parsed = updateMenteeSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const existing = await prisma.user.findUnique({
        where: { email: parsed.data.email },
    })
    if (existing && existing.id !== id) {
        return { error: "A user with this email already exists." }
    }

    const current = await prisma.user.findFirst({
        where: { id, role: "MENTEE" },
        select: { image: true, email: true },
    })
    const emailChanged = current && current.email !== parsed.data.email

    const data: {
        name: string
        email: string
        title: string | null
        bio: string | null
        image?: string | null
    } = {
        name: parsed.data.name,
        email: parsed.data.email,
        title: parsed.data.title || null,
        bio: parsed.data.bio || null,
    }
    if (parsed.data.image !== undefined) {
        data.image = parsed.data.image || null
    }

    await prisma.user.updateMany({
        where: { id, role: "MENTEE" },
        data: { ...data, ...(emailChanged ? CLEAR_PASSWORD_TOKEN : {}) },
    })

    if (emailChanged) {
        queueEmail(current.email, emailChangedEmail(parsed.data.email))
    }

    if (data.image !== undefined && current?.image && current.image !== data.image) {
        await deleteProfileImage(current.image)
    }

    await logAudit(session.user, "Updated mentee", "Mentee", id, parsed.data.email)

    revalidatePath("/mentees")
    revalidatePath(`/mentees/${id}`)
    redirect(`/mentees/${id}`)
}

export async function setMenteeActiveAction(id: string, isActive: boolean) {
    const session = await requireAdmin()

    const { count } = await prisma.user.updateMany({
        where: { id, role: "MENTEE", isActive: !isActive },
        data: { isActive },
    })

    if (count > 0) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { email: true },
        })
        if (user) queueEmail(user.email, accountStatusEmail(isActive))
    }

    await logAudit(
        session.user,
        isActive ? "Set mentee active" : "Set mentee inactive",
        "Mentee",
        id
    )

    revalidatePath("/mentees")
    revalidatePath(`/mentees/${id}`)
}

export async function deleteMenteeAction(id: string) {
    const session = await requireAdmin()

    const mentee = await prisma.user.findFirst({
        where: { id, role: "MENTEE" },
        select: { image: true },
    })

    await prisma.user.deleteMany({
        where: { id, role: "MENTEE" },
    })

    if (mentee?.image) {
        await deleteProfileImage(mentee.image)
    }

    await logAudit(session.user, "Deleted mentee", "Mentee", id)

    revalidatePath("/mentees")
    redirect("/mentees")
}
