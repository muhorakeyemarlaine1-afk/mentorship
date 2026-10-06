import { GoogleGenAI, ThinkingLevel, type Content } from "@google/genai"

export interface AssistantHistoryMessage {
    role: "user" | "assistant"
    content: string
}

/**
 * Replies come from Google AI Studio (Gemini API) when `GEMINI_API_KEY` is
 * set; without a key, a canned local reply keeps the chat usable in dev.
 */
const apiKey = process.env.GEMINI_API_KEY
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest"
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null
// Default (dynamic) thinking delays the first token by several seconds;
// chat replies don't need deep reasoning.
const THINKING_CONFIG = { thinkingLevel: ThinkingLevel.LOW }

const SYSTEM_INSTRUCTION = `You are a warm, practical mentorship assistant on a mentoring platform, talking with a mentee.
Help them think through career, study, and personal-growth questions: ask clarifying questions, offer concrete next steps, and keep replies concise and conversational (plain text, short paragraphs).
You are an AI, not a human mentor. If the mentee needs specialised, sensitive, or ongoing support, remind them they can ask to talk to a human mentor at any time.
If someone seems to be in crisis or at risk of harm, encourage them to contact local emergency services or a crisis line right away.`

function toGeminiContents(history: AssistantHistoryMessage[]): Content[] {
    return history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
    }))
}

/**
 * Streams the assistant's reply as plain text deltas. `signal` is passed to
 * the upstream request so abandoned chats stop generating (and billing).
 */
export async function* streamAssistantReply(
    history: AssistantHistoryMessage[],
    signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
    if (!ai) {
        yield* stubReply(history, signal)
        return
    }

    const stream = await ai.models.generateContentStream({
        model: MODEL,
        contents: toGeminiContents(history),
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            thinkingConfig: THINKING_CONFIG,
            abortSignal: signal,
        },
    })
    for await (const chunk of stream) {
        if (signal?.aborted) return
        if (chunk.text) yield chunk.text
    }
}

async function* stubReply(
    history: AssistantHistoryMessage[],
    signal?: AbortSignal
) {
    const last = history.at(-1)?.content ?? ""
    const canned = `Thanks for sharing that — tell me more about what's going on with "${last}". If you'd like, you can ask to talk to a human mentor at any point.`

    for (const word of canned.split(" ")) {
        if (signal?.aborted) return
        yield word + " "
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

    if (ai && firstUserMessage.trim()) {
        try {
            const res = await ai.models.generateContent({
                model: MODEL,
                contents: firstUserMessage.slice(0, 2000),
                config: {
                    thinkingConfig: THINKING_CONFIG,
                    systemInstruction:
                        "Write a 3-6 word title for a mentoring chat that opens with the user's message. Reply with the title only, no quotes or trailing punctuation.",
                },
            })
            const title = res.text
                ?.trim()
                .replace(/^["'“”]+|["'“”.]+$/g, "")
                .slice(0, 80)
            if (title) return title
        } catch (err) {
            console.error("Gemini title generation failed:", err)
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

const HUMAN_MENTOR_PATTERN =
    /\b(talk|speak|chat|connect me)\s+(to|with)\s+(a|an|my|the|some)?\s*(human|real person|person|mentor|someone)\b|\b(human|real) mentor\b/i

/**
 * Whether the mentee is asking to hand the chat over to a human mentor.
 * A real provider could replace this with a tool call / classifier.
 */
export function wantsHumanMentor(content: string) {
    return HUMAN_MENTOR_PATTERN.test(content)
}
