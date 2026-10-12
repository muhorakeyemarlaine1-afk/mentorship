"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"
import {
    addSystemMessage,
    displayName,
    escalateConversation,
    notifyAdmins,
} from "@/lib/conversations"

export async function startConversationAction() {
    const session = await auth()
    if (!session?.user || session.user.role !== "MENTEE") {
        return { error: "Only mentees can start a chat with the assistant." }
    }

    const mentee = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true },
    })
    if (!mentee) {
        return { error: "Your session is out of date. Please sign out and sign in again." }
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
    const isAssignedMentor = session.user.id === conversation.mentorId
    const isJoinedAdmin = session.user.id === conversation.adminId
    if (!isMentee && !isAssignedMentor && !isJoinedAdmin) {
        return {
            error:
                session.user.role === "ADMIN"
                    ? "Join this chat before replying."
                    : conversation.mentorId
                      ? "You don't have access to this conversation."
                      : "Claim this chat before replying.",
        }
    }

    await prisma.conversationMessage.create({
        data: {
            conversationId,
            author: isAssignedMentor ? "MENTOR" : isJoinedAdmin ? "ADMIN" : "MENTEE",
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

    const mentorName = session.user.name ?? session.user.email ?? "A mentor"
    await addSystemMessage(conversationId, `${mentorName} joined the chat.`)
    await prisma.notification.create({
        data: {
            userId: conversation.menteeId,
            title: "A mentor joined your chat",
            message: `${mentorName} will help you from here.`,
        },
    })

    revalidatePath("/chats")
    return { success: true }
}

export async function escalateToAdminAction(conversationId: string, note: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "MENTOR") {
        return { error: "Only mentors can escalate a chat." }
    }

    const trimmed = note.trim()
    if (!trimmed) {
        return { error: "Tell the admin what's going on." }
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { mentee: { select: { name: true, email: true } } },
    })
    if (!conversation || conversation.mentorId !== session.user.id) {
        return { error: "You can only escalate chats assigned to you." }
    }
    if (conversation.adminEscalatedAt) {
        return { error: "This chat is already waiting for an admin." }
    }

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { adminEscalatedAt: new Date(), adminEscalationNote: trimmed },
    })
    const mentorName = session.user.name ?? session.user.email ?? "The mentor"
    await addSystemMessage(conversationId, `${mentorName} asked an admin to step in.`)
    await notifyAdmins(
        "Chat escalated to admin",
        `${mentorName} needs help with ${displayName(conversation.mentee)}: ${trimmed}`
    )

    revalidatePath("/chats")
    return { success: true }
}

async function requireAdminForChat(conversationId: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        return { error: "Only admins can manage mentor requests." } as const
    }
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { mentor: { select: { name: true, email: true } } },
    })
    if (!conversation || conversation.status !== "ESCALATED") {
        return { error: "Conversation not found." } as const
    }
    return { session, conversation } as const
}

export async function assignMentorAction(conversationId: string, mentorId: string) {
    const ctx = await requireAdminForChat(conversationId)
    if ("error" in ctx) return { error: ctx.error }
    const { session, conversation } = ctx

    if (conversation.mentorId === mentorId) {
        return { error: "That mentor is already on this chat." }
    }
    const mentor = await prisma.user.findFirst({
        where: { id: mentorId, role: "MENTOR", isActive: true },
        select: { id: true, name: true, email: true },
    })
    if (!mentor) {
        return { error: "Pick an active mentor." }
    }

    await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            mentorId: mentor.id,
            adminEscalatedAt: null,
            adminEscalationNote: null,
        },
    })

    const mentorName = displayName(mentor)
    const previousName = displayName(conversation.mentor)
    await addSystemMessage(
        conversationId,
        previousName
            ? `An admin moved this chat from ${previousName} to ${mentorName}.`
            : `An admin connected ${mentorName} to this chat.`
    )
    await prisma.notification.createMany({
        data: [
            {
                userId: mentor.id,
                title: "Chat assigned to you",
                message: `An admin paired you with a mentee${conversation.title ? ` on "${conversation.title}"` : ""}.`,
            },
            {
                userId: conversation.menteeId,
                title: "A mentor joined your chat",
                message: `${mentorName} will help you from here.`,
            },
            ...(conversation.mentorId
                ? [
                      {
                          userId: conversation.mentorId,
                          title: "Chat reassigned",
                          message: `An admin moved a chat${conversation.title ? ` ("${conversation.title}")` : ""} to ${mentorName}.`,
                      },
                  ]
                : []),
        ],
    })
    await logAudit(session.user, "Assigned chat mentor", "Conversation", conversationId, mentor.email)

    revalidatePath("/chats")
    return { success: true }
}

export async function returnToQueueAction(conversationId: string) {
    const ctx = await requireAdminForChat(conversationId)
    if ("error" in ctx) return { error: ctx.error }
    const { session, conversation } = ctx

    if (!conversation.mentorId) {
        return { error: "This chat is already in the open queue." }
    }

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { mentorId: null, adminEscalatedAt: null, adminEscalationNote: null },
    })
    await addSystemMessage(
        conversationId,
        `An admin returned this chat to the open queue. Another mentor will pick it up.`
    )
    await prisma.notification.create({
        data: {
            userId: conversation.mentorId,
            title: "Chat reassigned",
            message: `An admin returned a chat${conversation.title ? ` ("${conversation.title}")` : ""} to the open queue.`,
        },
    })
    const mentors = await prisma.user.findMany({
        where: { role: "MENTOR", isActive: true, id: { not: conversation.mentorId } },
        select: { id: true },
    })
    await prisma.notification.createMany({
        data: mentors.map((m) => ({
            userId: m.id,
            title: "New mentor request",
            message: `A mentee needs a mentor${conversation.title ? ` about "${conversation.title}"` : ""}.`,
        })),
    })
    await logAudit(session.user, "Returned chat to queue", "Conversation", conversationId)

    revalidatePath("/chats")
    return { success: true }
}

export async function joinConversationAction(conversationId: string) {
    const ctx = await requireAdminForChat(conversationId)
    if ("error" in ctx) return { error: ctx.error }
    const { session, conversation } = ctx

    const result = await prisma.conversation.updateMany({
        where: { id: conversationId, adminId: null },
        data: { adminId: session.user.id, adminEscalatedAt: null, adminEscalationNote: null },
    })
    if (result.count === 0) {
        return { error: "Another admin has already joined this chat." }
    }

    const adminName = session.user.name ?? session.user.email ?? "An admin"
    await addSystemMessage(conversationId, `${adminName} (admin) joined the chat.`)
    await prisma.notification.createMany({
        data: [conversation.menteeId, conversation.mentorId]
            .filter((id): id is string => !!id)
            .map((userId) => ({
                userId,
                title: "An admin joined your chat",
                message: `${adminName} joined${conversation.title ? ` "${conversation.title}"` : " your chat"}.`,
            })),
    })
    await logAudit(session.user, "Joined chat", "Conversation", conversationId)

    revalidatePath("/chats")
    return { success: true }
}

export async function leaveConversationAction(conversationId: string) {
    const ctx = await requireAdminForChat(conversationId)
    if ("error" in ctx) return { error: ctx.error }
    const { session, conversation } = ctx

    if (conversation.adminId !== session.user.id) {
        return { error: "You haven't joined this chat." }
    }
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { adminId: null },
    })
    const adminName = session.user.name ?? session.user.email ?? "The admin"
    await addSystemMessage(conversationId, `${adminName} (admin) left the chat.`)

    revalidatePath("/chats")
    return { success: true }
}

export async function resolveEscalationAction(conversationId: string) {
    const ctx = await requireAdminForChat(conversationId)
    if ("error" in ctx) return { error: ctx.error }
    const { session, conversation } = ctx

    if (!conversation.adminEscalatedAt) {
        return { success: true }
    }
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { adminEscalatedAt: null, adminEscalationNote: null },
    })
    await addSystemMessage(conversationId, "An admin marked the escalation as resolved.")
    if (conversation.mentorId) {
        await prisma.notification.create({
            data: {
                userId: conversation.mentorId,
                title: "Escalation resolved",
                message: `An admin resolved your escalation${conversation.title ? ` on "${conversation.title}"` : ""}.`,
            },
        })
    }
    await logAudit(session.user, "Resolved chat escalation", "Conversation", conversationId)

    revalidatePath("/chats")
    return { success: true }
}
