"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
    createMentorSchema,
    updateMentorSchema,
    type CreateMentorInput,
    type UpdateMentorInput,
} from "@/lib/validations/mentor"

async function requireAdmin() {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }
    return session
}

export async function createMentorAction(values: CreateMentorInput) {
    await requireAdmin()

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

    revalidatePath("/mentors")
    redirect(`/mentors/${mentor.id}`)
}

export async function updateMentorAction(
    id: string,
    values: UpdateMentorInput
) {
    await requireAdmin()

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

    revalidatePath("/mentors")
    revalidatePath(`/mentors/${id}`)
    redirect(`/mentors/${id}`)
}

export async function setMentorActiveAction(id: string, isActive: boolean) {
    await requireAdmin()

    await prisma.user.updateMany({
        where: { id, role: "MENTOR" },
        data: { isActive },
    })

    revalidatePath("/mentors")
    revalidatePath(`/mentors/${id}`)
}

export async function deleteMentorAction(id: string) {
    await requireAdmin()

    await prisma.user.deleteMany({
        where: { id, role: "MENTOR" },
    })

    revalidatePath("/mentors")
    redirect("/mentors")
}
