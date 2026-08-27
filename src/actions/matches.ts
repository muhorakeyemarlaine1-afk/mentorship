"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { logAudit } from "@/lib/audit"

export async function createMatchAction(mentorId: string, menteeId: string) {
    const session = await requireAdmin()

    const [mentor, mentee] = await Promise.all([
        prisma.user.findFirst({ where: { id: mentorId, role: "MENTOR" } }),
        prisma.user.findFirst({ where: { id: menteeId, role: "MENTEE" } }),
    ])
    if (!mentor || !mentee) {
        return { error: "Select a valid mentor and mentee." }
    }

    const existing = await prisma.mentorMatch.findUnique({
        where: { mentorId_menteeId: { mentorId, menteeId } },
    })
    if (existing) {
        await prisma.mentorMatch.update({
            where: { id: existing.id },
            data: { status: "ACCEPTED" },
        })
    } else {
        await prisma.mentorMatch.create({
            data: { mentorId, menteeId, status: "ACCEPTED" },
        })
    }

    await prisma.notification.createMany({
        data: [mentorId, menteeId].map((userId) => ({
            userId,
            title: "New mentorship match",
            message: `You've been matched with ${userId === mentorId ? (mentee.name ?? mentee.email) : (mentor.name ?? mentor.email)}.`,
        })),
    })

    await logAudit(
        session.user,
        "Created match",
        "MentorMatch",
        undefined,
        `${mentor.email} ↔ ${mentee.email}`
    )

    revalidatePath("/ai-matchmaking")
    return { success: true }
}

export async function removeMatchAction(matchId: string) {
    const session = await requireAdmin()

    await prisma.mentorMatch.delete({ where: { id: matchId } })
    await logAudit(session.user, "Removed match", "MentorMatch", matchId)

    revalidatePath("/ai-matchmaking")
    return { success: true }
}
