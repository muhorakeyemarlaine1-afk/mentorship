"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { escalateConversation } from "@/lib/conversations"

export async function startConversationAction() {
    const session = await auth()
    if (!session?.user || session.user.role !== "MENTEE") {
        return { error: "Only mentees can start a chat with the assistant." }
    }

    const conversation = await prisma.conversation.create({
        data: { menteeId: session.user.id },
    })

    revalidatePath("/chats")
    return { success: true, conversationId: conversation.id }
}

export async function postHumanMessageAction(
    conversationId: string,
    content: string
) {
    const session = await auth()
    if (!session?.user) {
        return { error: "You must be signed in to send messages." }
    }

    const trimmed = content.trim()
    if (!trimmed) {
        return { error: "Message can't be empty." }
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
    })
    if (!conversation || conversation.status !== "ESCALATED") {
        return { error: "Conversation not found." }
    }

    const isMentee = session.user.id === conversation.menteeId
    const isClaimingMentor = session.user.id === conversation.mentorId
    if (!isMentee && !isClaimingMentor) {
        return {
            error: conversation.mentorId
                ? "You don't have access to this conversation."
                : "Claim this chat before replying.",
        }
    }

    await prisma.conversationMessage.create({
        data: {
            conversationId,
            author: isClaimingMentor ? "MENTOR" : "MENTEE",
            authorUserId: session.user.id,
            content: trimmed,
        },
    })
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    })

    revalidatePath("/chats")
    return { success: true }
}

export async function requestEscalationAction(conversationId: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "MENTEE") {
        return { error: "Only mentees can request a mentor." }
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
    })
    if (!conversation || conversation.menteeId !== session.user.id) {
        return { error: "Conversation not found." }
    }
    if (conversation.status === "ESCALATED") {
        return { success: true }
    }

    await escalateConversation(conversationId)

    revalidatePath("/chats")
    return { success: true }
}

export async function claimConversationAction(conversationId: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "MENTOR") {
        return { error: "Only mentors can claim a chat." }
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
    })
    if (!conversation) {
        return { error: "Conversation not found." }
    }

    const result = await prisma.conversation.updateMany({
        where: { id: conversationId, mentorId: null, status: "ESCALATED" },
        data: { mentorId: session.user.id },
    })
    if (result.count === 0) {
        return { error: "This chat was already claimed by another mentor." }
    }

    const mentor = await prisma.user.findUnique({
        where: { id: session.user.id },
    })
    await prisma.notification.create({
        data: {
            userId: conversation.menteeId,
            title: "A mentor joined your chat",
            message: `${mentor?.name ?? mentor?.email ?? "A mentor"} will help you from here.`,
        },
    })

    revalidatePath("/chats")
    return { success: true }
}
