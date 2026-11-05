"use server"

import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"
import { queueEmail } from "@/lib/mail"
import {
    applicationReceivedEmail,
    mentorApplicationEmail,
    welcomeEmail,
} from "@/lib/emails"
import {
    menteeSignUpSchema,
    mentorApplicationSchema,
    type MenteeSignUpInput,
    type MentorApplicationInput,
} from "@/lib/validations/application"

const REPEAT_EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000

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

    queueEmail(mentee.email, welcomeEmail(mentee.name ?? mentee.email))

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

    // The form is public, so repeat submissions can't be used to flood an
    // address or the admins' inboxes. The application itself is still saved.
    const recentApplication = await prisma.mentorApplication.findFirst({
        where: {
            email: parsed.data.email,
            createdAt: { gte: new Date(Date.now() - REPEAT_EMAIL_WINDOW_MS) },
        },
        select: { id: true },
    })

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
        select: { id: true, email: true, isActive: true },
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

    if (!recentApplication) {
        queueEmail(
            admins.filter((admin) => admin.isActive).map((admin) => admin.email),
            mentorApplicationEmail(application)
        )
        queueEmail(application.email, applicationReceivedEmail(application.name))
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
