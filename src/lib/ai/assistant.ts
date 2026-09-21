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
    const canned = `Thanks for sharing that — tell me more about what's going on with "${last}". If you'd like, you can also request a human mentor at any point using the button above.`

    for (const word of canned.split(" ")) {
        if (signal?.aborted) return
        yield word + " "
        await new Promise((resolve) => setTimeout(resolve, 40))
    }
}
