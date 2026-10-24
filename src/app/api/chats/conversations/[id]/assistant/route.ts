import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { escalateConversation } from "@/lib/conversations"
import {
    streamAssistantReply,
    suggestConversationTitle,
    wantsHumanMentor,
    errorMessage,
    type AssistantEvent,
    type AssistantHistoryMessage,
} from "@/lib/ai/assistant"

const HANDOFF_REPLY =
    "No problem — I've opened a request for a human mentor. The first available mentor will pick it up right here, and you'll see their replies in this conversation."

const ERROR_REPLY =
    "Sorry, I'm having trouble responding right now. Please try again in a moment, or ask to talk to a human mentor."

const ALREADY_REQUESTED_REPLY =
    "Your request for a human mentor is already in — the first available mentor will join this chat soon. In the meantime, I'm happy to keep helping."

async function* handoffReply(text: string): AsyncGenerator<AssistantEvent> {
    yield { type: "status", status: "handoff" }
    yield { type: "text", text }
}

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
    // After asking for a human, the mentee keeps the AI until someone joins.
    const humanJoined = !!conversation.mentorId || !!conversation.adminId
    if (conversation.status !== "AI_ONLY" && humanJoined) {
        return Response.json(
            { error: "A mentor has joined this chat." },
            { status: 409 }
        )
    }

    const body = await req.json().catch(() => null)
    const content = typeof body?.content === "string" ? body.content.trim() : ""
    if (!content) {
        return Response.json({ error: "Message can't be empty." }, { status: 400 })
    }

    // Save the mentee's message alongside the model call rather than before
    // it — DB round trips would otherwise delay the first streamed token.
    const savePromise = prisma.conversation.update({
        where: { id: conversationId },
        data: {
            updatedAt: new Date(),
            messages: {
                create: {
                    author: "MENTEE",
                    authorUserId: session.user.id,
                    content,
                },
            },
        },
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

    // Name the chat from its opening message so it's findable in the history.
    const titlePromise = conversation.title
        ? null
        : suggestConversationTitle(history)
            .then((title) =>
                prisma.conversation.update({
                    where: { id: conversationId },
                    data: { title },
                })
            )
            .catch(() => null)

    const alreadyEscalated = conversation.status === "ESCALATED"
    const handOff = wantsHumanMentor(content)
    if (handOff && !alreadyEscalated) {
        await savePromise
        await titlePromise
        await escalateConversation(conversationId)
    }

    const encoder = new TextEncoder()
    let full = ""

    // Newline-delimited JSON, so the client can show status changes
    // (connecting, thinking, responding) alongside the text.
    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const send = (event: AssistantEvent) =>
                controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"))
            try {
                send({ type: "status", status: "connecting" })
                const reply = handOff
                    ? handoffReply(
                          alreadyEscalated ? ALREADY_REQUESTED_REPLY : HANDOFF_REPLY
                      )
                    : streamAssistantReply(history, req.signal)
                for await (const event of reply) {
                    if (event.type === "text") {
                        if (!full) send({ type: "status", status: "responding" })
                        full += event.text
                    }
                    send(event)
                }
            } catch (err) {
                if (!req.signal.aborted) {
                    console.error("Assistant reply failed:", errorMessage(err))
                    if (!full.trim()) {
                        full = ERROR_REPLY
                        send({ type: "text", text: ERROR_REPLY })
                    }
                }
            } finally {
                await savePromise.catch((err) =>
                    console.error("Saving mentee message failed:", err)
                )
                await titlePromise
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
                }
                revalidatePath("/chats")
                controller.close()
            }
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Cache-Control": "no-store",
        },
    })
}
