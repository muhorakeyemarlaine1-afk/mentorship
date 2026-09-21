import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
    streamAssistantReply,
    type AssistantHistoryMessage,
} from "@/lib/ai/assistant"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user) {
        return Response.json({ error: "Unauthorized." }, { status: 401 })
    }

    const { id: conversationId } = await params
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
    })
    if (!conversation) {
        return Response.json(
            { error: "Conversation not found." },
            { status: 404 }
        )
    }
    if (conversation.menteeId !== session.user.id) {
        return Response.json(
            { error: "You don't have access to this conversation." },
            { status: 403 }
        )
    }
    if (conversation.status !== "AI_ONLY") {
        return Response.json(
            { error: "This chat has been escalated to a mentor." },
            { status: 409 }
        )
    }

    const body = await req.json().catch(() => null)
    const content = typeof body?.content === "string" ? body.content.trim() : ""
    if (!content) {
        return Response.json({ error: "Message can't be empty." }, { status: 400 })
    }

    await prisma.conversationMessage.create({
        data: {
            conversationId,
            author: "MENTEE",
            authorUserId: session.user.id,
            content,
        },
    })
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    })

    const history: AssistantHistoryMessage[] = [
        ...conversation.messages
            .filter((m) => m.author === "MENTEE" || m.author === "ASSISTANT")
            .map((m) => ({
                role: (m.author === "MENTEE" ? "user" : "assistant") as
                    | "user"
                    | "assistant",
                content: m.content,
            })),
        { role: "user", content },
    ]

    const encoder = new TextEncoder()
    let full = ""

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            try {
                for await (const chunk of streamAssistantReply(
                    history,
                    req.signal
                )) {
                    full += chunk
                    controller.enqueue(encoder.encode(chunk))
                }
            } finally {
                if (full.trim()) {
                    await prisma.conversationMessage.create({
                        data: {
                            conversationId,
                            author: "ASSISTANT",
                            content: full.trim(),
                        },
                    })
                    await prisma.conversation.update({
                        where: { id: conversationId },
                        data: { updatedAt: new Date() },
                    })
                    revalidatePath("/chats")
                }
                controller.close()
            }
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
        },
    })
}
