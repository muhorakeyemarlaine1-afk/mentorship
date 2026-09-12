"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { logAudit } from "@/lib/audit"
import { deleteProfileImage } from "@/lib/r2"
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
        select: { image: true },
    })

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
        data,
    })

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

    await prisma.user.updateMany({
        where: { id, role: "MENTEE" },
        data: { isActive },
    })

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
