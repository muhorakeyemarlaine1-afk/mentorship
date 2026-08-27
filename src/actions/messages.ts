"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function sendMessageAction(recipientId: string, content: string) {
    const session = await auth()
    if (!session?.user) {
        return { error: "You must be signed in to send messages." }
    }

    const trimmed = content.trim()
    if (!trimmed) {
        return { error: "Message can't be empty." }
    }

    const recipient = await prisma.user.findUnique({
        where: { id: recipientId },
    })
    if (!recipient) {
        return { error: "Recipient not found." }
    }

    await prisma.message.create({
        data: {
            senderId: session.user.id,
            recipientId,
            content: trimmed,
        },
    })

    revalidatePath("/chats")
    return { success: true }
}
