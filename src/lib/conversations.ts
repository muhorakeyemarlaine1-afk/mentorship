import { prisma } from "@/lib/prisma"

/**
 * Hands an AI conversation over to the humans by opening a ticket in the open
 * queue. Nobody is assigned automatically: any mentor can claim it, or an
 * admin can pair the mentee with a mentor.
 */
export async function escalateConversation(conversationId: string) {
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { mentee: { select: { name: true, email: true } } },
    })
    if (!conversation || conversation.status === "ESCALATED") return

    const menteeName =
        conversation.mentee.name ?? conversation.mentee.email ?? "A mentee"
    const topic = conversation.title ? ` about "${conversation.title}"` : ""

    await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            status: "ESCALATED",
            escalatedAt: new Date(),
            mentorId: null,
            messages: {
                create: {
                    author: "SYSTEM",
                    content: `${menteeName} asked for a human mentor. Waiting for a mentor to pick up this chat.`,
                },
            },
        },
    })

    const staff = await prisma.user.findMany({
        where: { role: { in: ["MENTOR", "ADMIN"] }, isActive: true },
        select: { id: true },
    })
    await prisma.notification.createMany({
        data: staff.map((user) => ({
            userId: user.id,
            title: "New mentor request",
            message: `${menteeName} wants to talk to a mentor${topic}.`,
        })),
    })
}

/** Records a chat event (claims, assignments, escalations) in the thread. */
export async function addSystemMessage(conversationId: string, content: string) {
    await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            updatedAt: new Date(),
            messages: { create: { author: "SYSTEM", content } },
        },
    })
}

export async function notifyAdmins(title: string, message: string) {
    const admins = await prisma.user.findMany({
        where: { role: "ADMIN", isActive: true },
        select: { id: true },
    })
    await prisma.notification.createMany({
        data: admins.map((admin) => ({ userId: admin.id, title, message })),
    })
}

export function displayName(user: { name: string | null; email: string } | null) {
    return user ? (user.name ?? user.email) : null
}
