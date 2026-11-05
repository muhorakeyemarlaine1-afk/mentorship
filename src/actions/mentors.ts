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
    createMentorSchema,
    updateMentorSchema,
    type CreateMentorInput,
    type UpdateMentorInput,
} from "@/lib/validations/mentor"

export async function createMentorAction(values: CreateMentorInput) {
    const session = await requireAdmin()

    const parsed = createMentorSchema.safeParse(values)
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

    const mentor = await prisma.user.create({
        data: {
            name: parsed.data.name,
            email: parsed.data.email,
            title: parsed.data.title || null,
            bio: parsed.data.bio || null,
            image: parsed.data.image || null,
            password: hashedPassword,
            role: "MENTOR",
            mustResetPassword: true,
        },
    })

    await logAudit(session.user, "Created mentor", "Mentor", mentor.id, mentor.email)

    queueEmail(
        mentor.email,
        inviteEmail(
            mentor.name,
            "MENTOR",
            await createPasswordToken(mentor.id, INVITE_TOKEN_TTL_MS)
        )
    )

    revalidatePath("/mentors")
    redirect(`/mentors/${mentor.id}`)
}

export async function updateMentorAction(
    id: string,
    values: UpdateMentorInput
) {
    const session = await requireAdmin()

    const parsed = updateMentorSchema.safeParse(values)
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
        where: { id, role: "MENTOR" },
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
        where: { id, role: "MENTOR" },
        data: { ...data, ...(emailChanged ? CLEAR_PASSWORD_TOKEN : {}) },
    })

    if (emailChanged) {
        queueEmail(current.email, emailChangedEmail(parsed.data.email))
    }

    if (data.image !== undefined && current?.image && current.image !== data.image) {
        await deleteProfileImage(current.image)
    }

    await logAudit(session.user, "Updated mentor", "Mentor", id, parsed.data.email)

    revalidatePath("/mentors")
    revalidatePath(`/mentors/${id}`)
    redirect(`/mentors/${id}`)
}

export async function setMentorActiveAction(id: string, isActive: boolean) {
    const session = await requireAdmin()

    const { count } = await prisma.user.updateMany({
        where: { id, role: "MENTOR", isActive: !isActive },
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
        isActive ? "Set mentor active" : "Set mentor inactive",
        "Mentor",
        id
    )

    revalidatePath("/mentors")
    revalidatePath(`/mentors/${id}`)
}

export async function deleteMentorAction(id: string) {
    const session = await requireAdmin()

    const mentor = await prisma.user.findFirst({
        where: { id, role: "MENTOR" },
        select: { image: true },
    })

    await prisma.user.deleteMany({
        where: { id, role: "MENTOR" },
    })

    if (mentor?.image) {
        await deleteProfileImage(mentor.image)
    }

    await logAudit(session.user, "Deleted mentor", "Mentor", id)

    revalidatePath("/mentors")
    redirect("/mentors")
}
