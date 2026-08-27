"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { logAudit } from "@/lib/audit"
import {
    createSessionSchema,
    type CreateSessionInput,
} from "@/lib/validations/session"

export async function createSessionAction(values: CreateSessionInput) {
    const session = await requireAdmin()

    const parsed = createSessionSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const scheduledAt = new Date(parsed.data.scheduledAt)
    if (Number.isNaN(scheduledAt.getTime())) {
        return { error: "Invalid date and time." }
    }

    const [mentor, mentee] = await Promise.all([
        prisma.user.findFirst({
            where: { id: parsed.data.mentorId, role: "MENTOR" },
        }),
        prisma.user.findFirst({
            where: { id: parsed.data.menteeId, role: "MENTEE" },
        }),
    ])
    if (!mentor || !mentee) {
        return { error: "Select a valid mentor and mentee." }
    }

    const created = await prisma.mentorshipSession.create({
        data: {
            mentorId: mentor.id,
            menteeId: mentee.id,
            scheduledAt,
            durationMinutes: parsed.data.durationMinutes,
            notes: parsed.data.notes || null,
        },
    })

    await prisma.notification.createMany({
        data: [mentor.id, mentee.id].map((userId) => ({
            userId,
            title: "New session scheduled",
            message: `A session between ${mentor.name ?? mentor.email} and ${mentee.name ?? mentee.email} was scheduled.`,
        })),
    })

    await logAudit(session.user, "Scheduled session", "Session", created.id)

    revalidatePath("/sessions")
    redirect(`/sessions/${created.id}`)
}

export async function setSessionStatusAction(
    id: string,
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED"
) {
    const session = await requireAdmin()

    await prisma.mentorshipSession.update({
        where: { id },
        data: { status },
    })

    await logAudit(
        session.user,
        `Marked session ${status.toLowerCase()}`,
        "Session",
        id
    )

    revalidatePath("/sessions")
    revalidatePath(`/sessions/${id}`)
}

export async function deleteSessionAction(id: string) {
    const session = await requireAdmin()

    await prisma.mentorshipSession.delete({ where: { id } })
    await logAudit(session.user, "Deleted session", "Session", id)

    revalidatePath("/sessions")
    redirect("/sessions")
}
