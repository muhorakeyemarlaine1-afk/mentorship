import { queueEmail } from "@/lib/mail"
import { prisma } from "@/lib/prisma"

/**
 * Writes an in-app notification for each user and emails the active ones, so
 * the two channels can't drift apart. `path` is where the email links to.
 */
export async function notifyUsers(
    userIds: string[],
    {
        title,
        message,
        path,
        actionLabel = "View details",
    }: {
        title: string
        message: string
        path: string
        actionLabel?: string
    }
) {
    if (userIds.length === 0) return

    await prisma.notification.createMany({
        data: userIds.map((userId) => ({ userId, title, message })),
    })

    const recipients = await prisma.user.findMany({
        where: { id: { in: userIds }, isActive: true },
        select: { email: true },
    })
    queueEmail(
        recipients.map((user) => user.email),
        {
            subject: title,
            lines: [message],
            action: { label: actionLabel, path },
        }
    )
}

const DEFAULT_TIMEZONE = "Africa/Nairobi"

/** Users have no timezone of their own, so one platform timezone is used. */
export function formatSessionTime(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    }

    try {
        return date.toLocaleString("en-GB", {
            ...options,
            timeZone: process.env.APP_TIMEZONE || DEFAULT_TIMEZONE,
        })
    } catch {
        // A mistyped APP_TIMEZONE shouldn't stop a session being saved.
        return date.toLocaleString("en-GB", {
            ...options,
            timeZone: DEFAULT_TIMEZONE,
        })
    }
}
