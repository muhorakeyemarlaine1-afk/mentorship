import { prisma } from "@/lib/prisma"

/**
 * Hands an AI conversation over to a human mentor by opening a ticket: it goes
 * straight to the mentee's matched mentor if they have one, otherwise into the
 * open queue for any mentor to claim.
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

    const match = await prisma.mentorMatch.findFirst({
        where: { menteeId: conversation.menteeId, status: "ACCEPTED" },
    })

    await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            status: "ESCALATED",
            escalatedAt: new Date(),
            mentorId: match?.mentorId ?? null,
        },
    })

    if (match) {
        await prisma.notification.create({
            data: {
                userId: match.mentorId,
                title: "Mentee requested help",
                message: `${menteeName} handed over a chat${topic} to you.`,
            },
        })
        return
    }

    const mentors = await prisma.user.findMany({
        where: { role: "MENTOR", isActive: true },
        select: { id: true },
    })
    await prisma.notification.createMany({
        data: mentors.map((mentor) => ({
            userId: mentor.id,
            title: "New mentor request",
            message: `${menteeName} wants to talk to a mentor${topic}.`,
        })),
    })
}
