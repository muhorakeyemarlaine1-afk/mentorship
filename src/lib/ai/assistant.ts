export interface AssistantHistoryMessage {
    role: "user" | "assistant"
    content: string
}

/**
 * Stub assistant reply generator. Swap the body for a real streaming provider
 * call (e.g. Anthropic Messages API with `stream: true`) that yields plain
 * text deltas — keep this exact signature so callers don't need to change.
 *
 * The stub ignores `signal` mid-generation since it has no real cost; a real
 * provider call should pass `signal` through to actually cancel the upstream
 * request on client disconnect instead of burning API spend on abandoned chats.
 */
export async function* streamAssistantReply(
    history: AssistantHistoryMessage[],
    signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
    const last = history.at(-1)?.content ?? ""
    const canned = `Thanks for sharing that — tell me more about what's going on with "${last}". If you'd like, you can ask to talk to a human mentor at any point.`

    for (const word of canned.split(" ")) {
        if (signal?.aborted) return
        yield word + " "
        await new Promise((resolve) => setTimeout(resolve, 40))
    }
}

/**
 * Stub title generator. Swap the body for a short, non-streaming provider call
 * ("Suggest a 3-6 word title for this conversation") — keep the signature.
 */
export async function suggestConversationTitle(
    history: AssistantHistoryMessage[]
): Promise<string> {
    const firstUserMessage =
        history.find((m) => m.role === "user")?.content ?? ""
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
