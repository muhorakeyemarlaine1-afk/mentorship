"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { logAudit } from "@/lib/audit"
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
            password: hashedPassword,
            role: "MENTOR",
            mustResetPassword: true,
        },
    })

    await logAudit(session.user, "Created mentor", "Mentor", mentor.id, mentor.email)

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

    await prisma.user.updateMany({
        where: { id, role: "MENTOR" },
        data: {
            name: parsed.data.name,
            email: parsed.data.email,
            title: parsed.data.title || null,
            bio: parsed.data.bio || null,
        },
    })

    await logAudit(session.user, "Updated mentor", "Mentor", id, parsed.data.email)

    revalidatePath("/mentors")
    revalidatePath(`/mentors/${id}`)
    redirect(`/mentors/${id}`)
}

export async function setMentorActiveAction(id: string, isActive: boolean) {
    const session = await requireAdmin()

    await prisma.user.updateMany({
        where: { id, role: "MENTOR" },
        data: { isActive },
    })

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

    await prisma.user.deleteMany({
        where: { id, role: "MENTOR" },
    })

    await logAudit(session.user, "Deleted mentor", "Mentor", id)

    revalidatePath("/mentors")
    redirect("/mentors")
}
