"use server"

import bcrypt from "bcryptjs"
import crypto from "crypto"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { logAudit } from "@/lib/audit"

const VALID_ROLES = ["ADMIN", "MENTOR", "MENTEE"] as const
type UserRole = (typeof VALID_ROLES)[number]

export async function updateUserRoleAction(id: string, role: UserRole) {
    const session = await requireAdmin()

    if (!VALID_ROLES.includes(role)) {
        return { error: "Invalid role." }
    }

    if (id === session.user.id && role !== "ADMIN") {
        return { error: "You can't change your own role." }
    }

    await prisma.user.update({ where: { id }, data: { role } })
    await logAudit(session.user, `Changed role to ${role}`, "User", id)

    revalidatePath("/users-roles")
    return { success: true }
}

export async function setUserActiveAction(id: string, isActive: boolean) {
    const session = await requireAdmin()

    if (id === session.user.id && !isActive) {
        return { error: "You can't deactivate your own account." }
    }

    await prisma.user.update({ where: { id }, data: { isActive } })
    await logAudit(
        session.user,
        isActive ? "Set user active" : "Set user inactive",
        "User",
        id
    )

    revalidatePath("/users-roles")
    return { success: true }
}

export async function deleteUserAction(id: string) {
    const session = await requireAdmin()

    if (id === session.user.id) {
        return { error: "You can't delete your own account." }
    }

    await prisma.user.delete({ where: { id } })
    await logAudit(session.user, "Deleted user", "User", id)

    revalidatePath("/users-roles")
    return { success: true }
}

function generateTempPassword() {
    return crypto.randomBytes(9).toString("base64url")
}

export async function approveMentorApplicationAction(applicationId: string) {
    const session = await requireAdmin()

    const application = await prisma.mentorApplication.findUnique({
        where: { id: applicationId },
    })
    if (!application || application.status !== "PENDING") {
        return { error: "Application not found or already reviewed." }
    }

    const existing = await prisma.user.findUnique({
        where: { email: application.email },
    })
    if (existing) {
        await prisma.mentorApplication.update({
            where: { id: applicationId },
            data: { status: "REJECTED" },
        })
        return {
            error: "A user with this email already exists. Application marked as rejected.",
        }
    }

    const tempPassword = generateTempPassword()
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const mentor = await prisma.user.create({
        data: {
            name: application.name,
            email: application.email,
            title: application.currentRole || null,
            bio: application.motivation || null,
            password: hashedPassword,
            role: "MENTOR",
            mustResetPassword: true,
        },
    })

    await prisma.mentorApplication.update({
        where: { id: applicationId },
        data: { status: "APPROVED" },
    })

    await prisma.notification.create({
        data: {
            userId: session.user.id,
            title: "Mentor application approved",
            message: `${application.name} was approved and added as a mentor.`,
        },
    })

    await logAudit(
        session.user,
        "Approved mentor application",
        "MentorApplication",
        applicationId,
        mentor.email
    )

    revalidatePath("/users-roles")
    revalidatePath("/mentors")
    return { success: true, email: mentor.email, tempPassword }
}

export async function rejectMentorApplicationAction(applicationId: string) {
    const session = await requireAdmin()

    const { count } = await prisma.mentorApplication.updateMany({
        where: { id: applicationId, status: "PENDING" },
        data: { status: "REJECTED" },
    })

    if (count === 0) {
        return { error: "Application not found or already reviewed." }
    }

    await logAudit(
        session.user,
        "Rejected mentor application",
        "MentorApplication",
        applicationId
    )

    revalidatePath("/users-roles")
    return { success: true }
}
