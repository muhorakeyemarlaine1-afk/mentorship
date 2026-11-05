"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { logAudit } from "@/lib/audit"
import { formatSessionTime, notifyUsers } from "@/lib/notify"
import {
    createSessionSchema,
    type CreateSessionInput,
} from "@/lib/validations/session"

const SESSION_PARTICIPANTS = {
    mentor: { select: { name: true, email: true } },
    mentee: { select: { name: true, email: true } },
}

const STATUS_NOTICES = {
    SCHEDULED: { title: "Session back on", outcome: "is back on the schedule" },
    COMPLETED: { title: "Session completed", outcome: "was marked as completed" },
    CANCELLED: { title: "Session cancelled", outcome: "was cancelled" },
}

function describeSession(session: {
    scheduledAt: Date
    mentor: { name: string | null; email: string }
    mentee: { name: string | null; email: string }
}) {
    return `The session between ${session.mentor.name ?? session.mentor.email} and ${session.mentee.name ?? session.mentee.email} on ${formatSessionTime(session.scheduledAt)}`
}

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

    await notifyUsers([mentor.id, mentee.id], {
        title: "New session scheduled",
        message: `A ${created.durationMinutes}-minute session between ${mentor.name ?? mentor.email} and ${mentee.name ?? mentee.email} was scheduled for ${formatSessionTime(scheduledAt)}.`,
        path: `/sessions/${created.id}`,
        actionLabel: "View session",
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

    const current = await prisma.mentorshipSession.findUnique({
        where: { id },
        select: { status: true },
    })

    const updated = await prisma.mentorshipSession.update({
        where: { id },
        data: { status },
        include: SESSION_PARTICIPANTS,
    })

    if (current?.status !== status) {
        const { title, outcome } = STATUS_NOTICES[status]
        await notifyUsers([updated.mentorId, updated.menteeId], {
            title,
            message: `${describeSession(updated)} ${outcome}.`,
            path: `/sessions/${id}`,
            actionLabel: "View session",
        })
    }

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

    const deleted = await prisma.mentorshipSession.delete({
        where: { id },
        include: SESSION_PARTICIPANTS,
    })
    await logAudit(session.user, "Deleted session", "Session", id)

    // Deleting an upcoming session cancels it for the people attending.
    if (deleted.status === "SCHEDULED" && deleted.scheduledAt > new Date()) {
        await notifyUsers([deleted.mentorId, deleted.menteeId], {
            title: STATUS_NOTICES.CANCELLED.title,
            message: `${describeSession(deleted)} ${STATUS_NOTICES.CANCELLED.outcome}.`,
            path: "/sessions",
            actionLabel: "View sessions",
        })
    }

    revalidatePath("/sessions")
    redirect("/sessions")
}
