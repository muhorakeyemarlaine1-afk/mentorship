"use server"

import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"
import {
    menteeSignUpSchema,
    mentorApplicationSchema,
    type MenteeSignUpInput,
    type MentorApplicationInput,
} from "@/lib/validations/application"

export async function signUpMenteeAction(values: MenteeSignUpInput) {
    const parsed = menteeSignUpSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const existing = await prisma.user.findUnique({
        where: { email: parsed.data.email },
    })
    if (existing) {
        return { error: "An account with this email already exists." }
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

    const mentee = await prisma.user.create({
        data: {
            name: parsed.data.name,
            email: parsed.data.email,
            title: parsed.data.category || null,
            password: hashedPassword,
            role: "MENTEE",
        },
    })

    await logAudit(null, "Mentee signed up", "Mentee", mentee.id, mentee.email)

    return { success: true }
}

export async function submitMentorApplicationAction(
    values: MentorApplicationInput
) {
    const parsed = mentorApplicationSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: parsed.data.email },
    })
    if (existingUser) {
        return { error: "An account with this email already exists." }
    }

    const application = await prisma.mentorApplication.create({
        data: {
            name: parsed.data.name,
            email: parsed.data.email,
            currentRole: parsed.data.currentRole || null,
            organization: parsed.data.organization || null,
            category: parsed.data.category || null,
            yearsExperience: parsed.data.yearsExperience || null,
            motivation: parsed.data.motivation || null,
            linkedin: parsed.data.linkedin || null,
        },
    })

    const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
    })
    if (admins.length > 0) {
        await prisma.notification.createMany({
            data: admins.map((admin) => ({
                userId: admin.id,
                title: "New mentor application",
                message: `${application.name} applied to become a mentor.`,
            })),
        })
    }

    await logAudit(
        null,
        "Mentor application submitted",
        "MentorApplication",
        application.id,
        application.email
    )

    return { success: true }
}
