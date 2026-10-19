import { OpenRouter } from "@openrouter/sdk"

export interface AssistantHistoryMessage {
    role: "user" | "assistant"
    content: string
}

/**
 * Replies come from OpenRouter when `OPENROUTER_API_KEY` is set; without a
 * key, a canned local reply keeps the chat usable in dev.
 */
const apiKey = process.env.OPENROUTER_API_KEY
const MODEL =
    process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free"
const openRouter = apiKey
    ? new OpenRouter({
          apiKey,
          httpReferer: process.env.APP_URL,
          appTitle: "Mentorship",
      })
    : null
// Nemotron reasons before answering; keep it light so the first token
// isn't delayed by several seconds. Chat replies don't need deep reasoning.
const REASONING = { effort: "low" } as const

const SYSTEM_INSTRUCTION = `You are a warm, practical mentorship assistant on a mentoring platform, talking with a mentee.
Help them think through career, study, and personal-growth questions: ask clarifying questions, offer concrete next steps, and keep replies concise and conversational.
Format with light Markdown: short paragraphs, numbered or bulleted lists for steps and options, and occasional **bold** for key points. Don't use headings, tables, or code blocks unless asked.
You are an AI, not a human mentor. If the mentee needs specialised, sensitive, or ongoing support, remind them they can ask to talk to a human mentor at any time.
If someone seems to be in crisis or at risk of harm, encourage them to contact local emergency services or a crisis line right away.`

/** Where the reply is up to, shown to the mentee while it streams. */
export type AssistantStatus = "connecting" | "thinking" | "responding" | "handoff"

/** One line of the newline-delimited JSON stream sent to the chat client. */
export type AssistantEvent =
    | { type: "status"; status: AssistantStatus }
    | { type: "text"; text: string }

/**
 * Streams the assistant's reply as status changes and text deltas. `signal`
 * is passed to the upstream request so abandoned chats stop generating (and
 * billing).
 */
export async function* streamAssistantReply(
    history: AssistantHistoryMessage[],
    signal?: AbortSignal
): AsyncGenerator<AssistantEvent, void, unknown> {
    if (!openRouter) {
        yield* stubReply(history, signal)
        return
    }

    const stream = await openRouter.chat.send(
        {
            chatRequest: {
                model: MODEL,
                messages: [
                    { role: "system", content: SYSTEM_INSTRUCTION },
                    ...history,
                ],
                reasoning: REASONING,
                stream: true,
            },
        },
        { signal }
    )
    if (!(Symbol.asyncIterator in stream)) {
        throw new Error("OpenRouter returned a non-streaming response.")
    }
    let thinking = false
    for await (const chunk of stream) {
        if (signal?.aborted) return
        const delta = chunk.choices[0]?.delta
        if (delta?.reasoning && !thinking) {
            thinking = true
            yield { type: "status", status: "thinking" }
        }
        if (delta?.content) yield { type: "text", text: delta.content }
    }
}

async function* stubReply(
    history: AssistantHistoryMessage[],
    signal?: AbortSignal
): AsyncGenerator<AssistantEvent, void, unknown> {
    const last = history.at(-1)?.content ?? ""
    const canned = `Thanks for sharing that — tell me more about what's going on with "${last}". If you'd like, you can ask to talk to a human mentor at any point.`

    yield { type: "status", status: "thinking" }
    await new Promise((resolve) => setTimeout(resolve, 800))
    for (const word of canned.split(" ")) {
        if (signal?.aborted) return
        yield { type: "text", text: word + " " }
        await new Promise((resolve) => setTimeout(resolve, 40))
    }
}

/**
 * Short title for the chat history list. Falls back to the opening message
 * when there's no API key or the model call fails.
 */
export async function suggestConversationTitle(
    history: AssistantHistoryMessage[]
): Promise<string> {
    const firstUserMessage =
        history.find((m) => m.role === "user")?.content ?? ""

    if (openRouter && firstUserMessage.trim()) {
        try {
            const res = await openRouter.chat.send({
                chatRequest: {
                    model: MODEL,
                    messages: [
                        {
                            role: "system",
                            content:
                                "Write a 3-6 word title for a mentoring chat that opens with the user's message. Reply with the title only, no quotes or trailing punctuation.",
                        },
                        {
                            role: "user",
                            content: firstUserMessage.slice(0, 2000),
                        },
                    ],
                    reasoning: REASONING,
                    stream: false,
                },
            })
            const content =
                "choices" in res ? res.choices[0]?.message.content : null
            const title =
                typeof content === "string"
                    ? content
                          .trim()
                          .replace(/^["'“”]+|["'“”.]+$/g, "")
                          .slice(0, 80)
                    : ""
            if (title) return title
        } catch (err) {
            console.error("OpenRouter title generation failed:", errorMessage(err))
        }
    }

    const cleaned = firstUserMessage
        .replace(/\s+/g, " ")
        .replace(/^(hi|hello|hey)[,!. ]*/i, "")
        .trim()
    if (!cleaned) return "New chat"

    const words = cleaned.split(" ").slice(0, 6).join(" ")
    const title = words.length < cleaned.length ? `${words}…` : words
    return title.charAt(0).toUpperCase() + title.slice(1)
}

/**
 * Log-safe description of a provider error. SDK errors carry the raw request,
 * including the `Authorization` header, so never log the error object itself.
 */
export function errorMessage(err: unknown) {
    return err instanceof Error ? err.message : String(err)
}

const HUMAN_MENTOR_PATTERN =
    /\b(talk|speak|chat|connect me)\s+(to|with)\s+(a|an|my|the|some)?\s*(human|real person|person|mentor|someone)\b|\b(human|real) mentor\b/i

/**
 * Whether the mentee is asking to hand the chat over to a human mentor.
 * A real provider could replace this with a tool call / classifier.
 */
export function wantsHumanMentor(content: string) {
    return HUMAN_MENTOR_PATTERN.test(content)
}
