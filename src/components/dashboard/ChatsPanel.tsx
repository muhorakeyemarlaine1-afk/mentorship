"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"

import {
    assignMentorAction,
    claimConversationAction,
    escalateToAdminAction,
    joinConversationAction,
    leaveConversationAction,
    postHumanMessageAction,
    requestEscalationAction,
    resolveEscalationAction,
    returnToQueueAction,
    startConversationAction,
} from "@/actions/conversations"
import { AssistantMessage } from "@/components/dashboard/AssistantMessage"
import {
    HistoryIcon,
    PlusIcon,
    SearchIcon,
    SendIcon,
    SparkleIcon,
    UserIcon,
    XIcon,
} from "@/components/dashboard/icons"

export interface ConversationSummary {
    id: string
    title: string | null
    menteeId: string
    menteeName: string
    mentorId: string | null
    mentorName: string | null
    adminId: string | null
    adminName: string | null
    status: "AI_ONLY" | "ESCALATED"
    /** A mentee request no mentor has picked up yet. */
    isOpenQueueItem: boolean
    /** The assigned mentor escalated the chat to an admin. */
    needsAdmin: boolean
    escalationNote: string | null
    time: string
}

export interface ConversationMessageView {
    id: string
    author: "MENTEE" | "ASSISTANT" | "MENTOR" | "ADMIN" | "SYSTEM"
    authorName: string | null
    mine: boolean
    text: string
    time: string
}

export interface MentorOption {
    id: string
    name: string
    title: string | null
    activeChats: number
    matchedMenteeIds: string[]
}

type Role = "ADMIN" | "MENTOR" | "MENTEE"

const SUGGESTIONS = [
    "Help me set goals for this quarter",
    "How do I prepare for my next mentorship session?",
    "I'd like advice on growing my career",
]

function conversationTitle(c: ConversationSummary) {
    return c.title ?? "New chat"
}

function conversationStatusLabel(c: ConversationSummary, viewerRole: Role) {
    if (viewerRole === "ADMIN") {
        const mentor = c.mentorName ? `with ${c.mentorName}` : "unassigned"
        return `${c.menteeName} · ${c.needsAdmin ? "escalated, " : ""}${mentor}`
    }
    if (viewerRole === "MENTOR") {
        if (c.isOpenQueueItem) return `${c.menteeName} · needs a mentor`
        if (c.needsAdmin) return `${c.menteeName} · waiting for an admin`
        return c.adminName
            ? `${c.menteeName} · with ${c.adminName} (admin)`
            : c.menteeName
    }
    if (c.status === "AI_ONLY") return "AI assistant"
    if (c.mentorId) return `With ${c.mentorName ?? "your mentor"}`
    if (c.adminId) return `With ${c.adminName ?? "an admin"}`
    return "Waiting for a mentor"
}

/**
 * Reveals streamed text a few characters per frame. The model sends text in
 * ~100-character bursts; without this each burst appears all at once. The
 * pace scales with the backlog so the reveal never falls far behind.
 */
function createTypewriter(onUpdate: (text: string) => void) {
    let target = ""
    let shown = 0
    let frame: number | null = null
    let onDone: (() => void) | null = null

    function tick() {
        const backlog = target.length - shown
        if (backlog <= 0) {
            frame = null
            onDone?.()
            return
        }
        shown += Math.max(1, Math.ceil(backlog / 30))
        onUpdate(target.slice(0, shown))
        frame = requestAnimationFrame(tick)
    }

    return {
        push(text: string) {
            target = text
            frame ??= requestAnimationFrame(tick)
        },
        /** Resolves once everything pushed so far has been revealed. */
        finish() {
            return new Promise<void>((resolve) => {
                if (frame === null) return resolve()
                onDone = resolve
            })
        },
    }
}

function TypingDots() {
    return (
        <span
            role="status"
            aria-label="AI Assistant is typing"
            className="flex items-center gap-1 h-5"
        >
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-[#E07830] animate-bounce motion-reduce:animate-pulse"
                    style={{ animationDelay: `${delay}ms` }}
                />
            ))}
        </span>
    )
}

function authorLabel(m: ConversationMessageView, c: ConversationSummary) {
    if (m.author === "ASSISTANT") return "AI Assistant"
    if (m.mine) return "You"
    if (m.author === "MENTOR") return m.authorName ?? "Mentor"
    if (m.author === "ADMIN") return `${m.authorName ?? "Admin"} (admin)`
    return c.menteeName
}

export function ChatsPanel({
    conversations,
    activeConversation,
    conversationMessages,
    currentUserId,
    currentUserRole,
    mentorOptions,
}: {
    conversations: ConversationSummary[]
    activeConversation: ConversationSummary | null
    conversationMessages: ConversationMessageView[]
    currentUserId: string
    currentUserRole: Role
    mentorOptions: MentorOption[]
}) {
    const router = useRouter()
    const [historyOpen, setHistoryOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [draft, setDraft] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [pendingText, setPendingText] = useState<string | null>(null)
    const [streamingText, setStreamingText] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)
    const [escalateOpen, setEscalateOpen] = useState(false)
    const [escalationNote, setEscalationNote] = useState("")
    const [selectedMentorId, setSelectedMentorId] = useState("")
    const bottomRef = useRef<HTMLDivElement>(null)

    const isMentee = currentUserRole === "MENTEE"
    const isMentor = currentUserRole === "MENTOR"
    const isAdmin = currentUserRole === "ADMIN"

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: "end" })
    }, [conversationMessages.length, pendingText, streamingText])

    useEffect(() => {
        if (!historyOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setHistoryOpen(false)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [historyOpen])

    const query = search.trim().toLowerCase()
    const filtered = conversations.filter(
        (c) =>
            !query ||
            conversationTitle(c).toLowerCase().includes(query) ||
            c.menteeName.toLowerCase().includes(query),
    )
    const openRequests = filtered.filter((c) => c.isOpenQueueItem)
    const ownChats = filtered.filter((c) => !c.isOpenQueueItem)
    const escalatedChats = filtered.filter((c) => c.needsAdmin)
    const assignedChats = filtered.filter(
        (c) => !c.needsAdmin && !c.isOpenQueueItem,
    )

    // Mentees always talk to the AI unless the chat was handed to a mentor;
    // a brand new chat (no conversation yet) is created on first send.
    const talkingToAi =
        isMentee &&
        (!activeConversation || activeConversation.status === "AI_ONLY")

    const canCompose =
        isMentee ||
        (isMentor && activeConversation?.mentorId === currentUserId) ||
        (isAdmin && activeConversation?.adminId === currentUserId)

    const canClaim = isMentor && !!activeConversation?.isOpenQueueItem

    const canEscalate =
        isMentor &&
        activeConversation?.mentorId === currentUserId &&
        !activeConversation.needsAdmin

    // Admins can pair the mentee with anyone but the mentor already on it.
    const assignableMentors = mentorOptions.filter(
        (m) => m.id !== activeConversation?.mentorId,
    )

    async function sendToAi(content: string) {
        setIsStreaming(true)
        setPendingText(content)
        setStreamingText("")

        let conversationId = activeConversation?.id
        try {
            if (!conversationId) {
                const result = await startConversationAction()
                if (!result.success) {
                    setError(result.error ?? "Couldn't start a chat.")
                    setDraft(content)
                    return
                }
                conversationId = result.conversationId
            }

            const res = await fetch(
                `/api/chats/conversations/${conversationId}/assistant`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content }),
                },
            )
            if (!res.ok || !res.body) {
                const body = await res.json().catch(() => null)
                setError(body?.error ?? "The assistant couldn't reply.")
                return
            }
            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            const typewriter = createTypewriter(setStreamingText)
            let acc = ""
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                acc += decoder.decode(value, { stream: true })
                typewriter.push(acc)
            }
            await typewriter.finish()
        } finally {
            if (conversationId && conversationId !== activeConversation?.id) {
                router.replace(`/chats?conversation=${conversationId}`)
            } else {
                // Clear the optimistic bubbles in the same transition as the
                // refresh, so they're swapped for the saved messages in one
                // commit instead of vanishing until the refresh lands.
                startTransition(() => {
                    router.refresh()
                    setIsStreaming(false)
                    setPendingText(null)
                    setStreamingText("")
                })
            }
        }
    }

    function handleSend(e: React.FormEvent) {
        e.preventDefault()
        const content = draft.trim()
        if (!content || isStreaming || isPending) return
        setDraft("")
        setError(null)

        if (talkingToAi) {
            void sendToAi(content)
            return
        }
        if (!activeConversation) return
        setPendingText(content)
        startTransition(async () => {
            const result = await postHumanMessageAction(
                activeConversation.id,
                content,
            )
            if (result.error) {
                setError(result.error)
                setDraft(content)
            }
            setPendingText(null)
        })
    }

    function handleRequestMentor() {
        if (!activeConversation) return
        startTransition(async () => {
            const result = await requestEscalationAction(activeConversation.id)
            if (result.error) setError(result.error)
            router.refresh()
        })
    }

    function runAction(
        action: () => Promise<{ error?: string; success?: boolean }>,
        onSuccess?: () => void,
    ) {
        setError(null)
        startTransition(async () => {
            const result = await action()
            if (result.error) setError(result.error)
            else onSuccess?.()
            router.refresh()
        })
    }

    function handleClaim() {
        if (!activeConversation) return
        runAction(() => claimConversationAction(activeConversation.id))
    }

    function handleEscalate(e: React.FormEvent) {
        e.preventDefault()
        if (!activeConversation || !escalationNote.trim()) return
        runAction(
            () => escalateToAdminAction(activeConversation.id, escalationNote),
            () => {
                setEscalateOpen(false)
                setEscalationNote("")
            },
        )
    }

    function handleAssign(e: React.FormEvent) {
        e.preventDefault()
        if (!activeConversation || !selectedMentorId) return
        runAction(
            () => assignMentorAction(activeConversation.id, selectedMentorId),
            () => setSelectedMentorId(""),
        )
    }

    function renderConversationLink(c: ConversationSummary) {
        const active = activeConversation?.id === c.id
        return (
            <Link
                key={c.id}
                href={`/chats?conversation=${c.id}`}
                onClick={() => setHistoryOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    active ? "bg-[#F3EFFF]" : "hover:bg-[#F6F7FB]"
                }`}
            >
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        c.status === "AI_ONLY"
                            ? "bg-[#FEF4EC] text-[#E07830]"
                            : "bg-[#EFEAFF] text-[#6C4FE0]"
                    }`}
                >
                    {c.status === "AI_ONLY" ? (
                        <SparkleIcon className="w-3.5 h-3.5" />
                    ) : (
                        <UserIcon className="w-3.5 h-3.5" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-[#171139] truncate">
                            {conversationTitle(c)}
                        </p>
                        <span className="text-[11px] text-[#9C97BE] shrink-0">
                            {c.time}
                        </span>
                    </div>
                    <p className="text-xs text-[#6B6690] truncate">
                        {c.needsAdmin && !isMentee && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D14343] mr-1.5 align-middle" />
                        )}
                        {conversationStatusLabel(c, currentUserRole)}
                    </p>
                </div>
            </Link>
        )
    }

    const showMessages = conversationMessages.length > 0 || pendingText !== null

    return (
        <div className="flex-1 min-h-0 px-4 sm:px-8 pb-6">
            <div className="relative h-full flex gap-4 overflow-hidden rounded-2xl lg:overflow-visible lg:rounded-none">
                {/* Chat */}
                <section className="flex-1 min-w-0 bg-white rounded-2xl border border-[#EDEBF6] flex flex-col min-h-0">
                    <header className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-[#EDEBF6] shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-[#FEF4EC] text-[#E07830] flex items-center justify-center shrink-0">
                                <SparkleIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-[#171139] truncate">
                                    {activeConversation
                                        ? conversationTitle(activeConversation)
                                        : isMentee
                                          ? "New chat"
                                          : "Chats"}
                                </p>
                                <p className="text-xs text-[#6B6690] truncate">
                                    {activeConversation
                                        ? conversationStatusLabel(
                                              activeConversation,
                                              currentUserRole,
                                          )
                                        : isMentee
                                          ? "AI assistant"
                                          : "Select a chat from the history"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {isMentee &&
                                activeConversation?.status === "AI_ONLY" && (
                                    <button
                                        type="button"
                                        onClick={handleRequestMentor}
                                        disabled={isPending || isStreaming}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-[#6C4FE0] border border-[#E4DBFF] px-3 py-1.5 rounded-full hover:bg-[#F3EFFF] transition-colors disabled:opacity-60"
                                    >
                                        <UserIcon className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">
                                            Talk to a mentor
                                        </span>
                                        <span className="sm:hidden">
                                            Mentor
                                        </span>
                                    </button>
                                )}

                            {canClaim && (
                                <button
                                    type="button"
                                    onClick={handleClaim}
                                    disabled={isPending}
                                    className="text-xs font-semibold bg-[#6C4FE0] text-white px-3 py-1.5 rounded-full hover:bg-[#5B3FD6] transition-colors disabled:opacity-60"
                                >
                                    Claim this chat
                                </button>
                            )}

                            {canEscalate && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEscalateOpen((open) => !open)
                                    }
                                    aria-expanded={escalateOpen}
                                    disabled={isPending}
                                    className="text-xs font-semibold text-[#D14343] border border-[#F5D0D0] px-3 py-1.5 rounded-full hover:bg-[#FDF2F2] transition-colors disabled:opacity-60"
                                >
                                    Escalate
                                </button>
                            )}

                            {isAdmin &&
                                activeConversation &&
                                (activeConversation.adminId ===
                                currentUserId ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            runAction(() =>
                                                leaveConversationAction(
                                                    activeConversation.id,
                                                ),
                                            )
                                        }
                                        disabled={isPending}
                                        className="text-xs font-semibold text-[#6C4FE0] border border-[#E4DBFF] px-3 py-1.5 rounded-full hover:bg-[#F3EFFF] transition-colors disabled:opacity-60"
                                    >
                                        Leave chat
                                    </button>
                                ) : (
                                    !activeConversation.adminId && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                runAction(() =>
                                                    joinConversationAction(
                                                        activeConversation.id,
                                                    ),
                                                )
                                            }
                                            disabled={isPending}
                                            className="text-xs font-semibold bg-[#6C4FE0] text-white px-3 py-1.5 rounded-full hover:bg-[#5B3FD6] transition-colors disabled:opacity-60"
                                        >
                                            Join chat
                                        </button>
                                    )
                                ))}

                            <button
                                type="button"
                                onClick={() => setHistoryOpen(true)}
                                aria-label="Open chat history"
                                aria-expanded={historyOpen}
                                aria-controls="chat-history"
                                className="lg:hidden w-9 h-9 rounded-full border border-[#EDEBF6] flex items-center justify-center text-[#6B6690] hover:bg-[#F6F7FB] transition-colors"
                            >
                                <HistoryIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </header>

                    {escalateOpen && canEscalate && (
                        <form
                            onSubmit={handleEscalate}
                            className="flex flex-col gap-2 px-4 sm:px-5 py-3 border-b border-[#EDEBF6] bg-[#FDF8F8] shrink-0"
                        >
                            <label
                                htmlFor="escalation-note"
                                className="text-xs font-semibold text-[#171139]"
                            >
                                What do you need an admin to help with?
                            </label>
                            <textarea
                                id="escalation-note"
                                value={escalationNote}
                                onChange={(e) =>
                                    setEscalationNote(e.target.value)
                                }
                                rows={2}
                                placeholder="e.g. This needs a mentor with finance experience, or the mentee would like someone else."
                                className="w-full px-3 py-2 rounded-xl border border-[#EDEBF6] bg-white text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0] resize-none"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEscalateOpen(false)}
                                    className="text-xs font-semibold text-[#6B6690] px-3 py-1.5 rounded-full hover:bg-[#F6F7FB]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        isPending || !escalationNote.trim()
                                    }
                                    className="text-xs font-semibold bg-[#D14343] text-white px-3 py-1.5 rounded-full hover:bg-[#B93636] transition-colors disabled:opacity-60"
                                >
                                    Escalate to admin
                                </button>
                            </div>
                        </form>
                    )}

                    {!isMentee && activeConversation?.needsAdmin && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 sm:px-5 py-3 border-b border-[#EDEBF6] bg-[#FDF2F2] shrink-0">
                            <p className="flex-1 min-w-0 text-xs text-[#171139]">
                                <span className="font-semibold text-[#D14343]">
                                    Escalated to admin
                                </span>
                                {activeConversation.escalationNote && (
                                    <>
                                        {" "}
                                        · &ldquo;
                                        {activeConversation.escalationNote}
                                        &rdquo;
                                    </>
                                )}
                            </p>
                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        runAction(() =>
                                            resolveEscalationAction(
                                                activeConversation.id,
                                            ),
                                        )
                                    }
                                    disabled={isPending}
                                    className="self-start sm:self-auto text-xs font-semibold text-[#6B6690] border border-[#EDEBF6] bg-white px-3 py-1.5 rounded-full hover:bg-[#F6F7FB] transition-colors disabled:opacity-60 shrink-0"
                                >
                                    Mark resolved
                                </button>
                            )}
                        </div>
                    )}

                    {isAdmin && activeConversation && (
                        <form
                            onSubmit={handleAssign}
                            className="flex flex-wrap items-center gap-2 px-4 sm:px-5 py-3 border-b border-[#EDEBF6] bg-[#F9F8FD] shrink-0"
                        >
                            <label htmlFor="assign-mentor" className="sr-only">
                                {activeConversation.mentorId
                                    ? "Move to another mentor"
                                    : "Pair with a mentor"}
                            </label>
                            <select
                                id="assign-mentor"
                                value={selectedMentorId}
                                onChange={(e) =>
                                    setSelectedMentorId(e.target.value)
                                }
                                className="flex-1 min-w-0 basis-48 px-3 py-1.5 rounded-xl border border-[#EDEBF6] bg-white text-sm text-[#171139] focus:outline-none focus:border-[#6C4FE0]"
                            >
                                <option value="">
                                    {activeConversation.mentorId
                                        ? "Move to another mentor…"
                                        : "Pair with a mentor…"}
                                </option>
                                {assignableMentors.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
                                        {m.title ? ` · ${m.title}` : ""}
                                        {` · ${m.activeChats} active`}
                                        {m.matchedMenteeIds.includes(
                                            activeConversation.menteeId,
                                        )
                                            ? " · matched"
                                            : ""}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={isPending || !selectedMentorId}
                                className="text-xs font-semibold bg-[#6C4FE0] text-white px-3 py-1.5 rounded-full hover:bg-[#5B3FD6] transition-colors disabled:opacity-60"
                            >
                                {activeConversation.mentorId
                                    ? "Reassign"
                                    : "Assign"}
                            </button>
                            {activeConversation.mentorId && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        runAction(() =>
                                            returnToQueueAction(
                                                activeConversation.id,
                                            ),
                                        )
                                    }
                                    disabled={isPending}
                                    className="text-xs font-semibold text-[#6B6690] border border-[#EDEBF6] bg-white px-3 py-1.5 rounded-full hover:bg-[#F6F7FB] transition-colors disabled:opacity-60"
                                >
                                    Return to queue
                                </button>
                            )}
                        </form>
                    )}

                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
                        {showMessages ? (
                            <div className="flex flex-col gap-4">
                                {conversationMessages.map((m) =>
                                    m.author === "SYSTEM" ? (
                                        <p
                                            key={m.id}
                                            className="self-center max-w-md text-center text-[11px] text-[#9C97BE] px-3 py-1 rounded-full bg-[#F6F7FB]"
                                        >
                                            {m.text} · {m.time}
                                        </p>
                                    ) : m.author === "ASSISTANT" ? (
                                        <AssistantMessage
                                            key={m.id}
                                            text={m.text}
                                            label={`${
                                                activeConversation
                                                    ? authorLabel(
                                                          m,
                                                          activeConversation,
                                                      )
                                                    : "AI Assistant"
                                            } · ${m.time}`}
                                        />
                                    ) : (
                                        <div
                                            key={m.id}
                                            className={`flex flex-col ${
                                                m.mine
                                                    ? "items-end"
                                                    : "items-start"
                                            }`}
                                        >
                                            <span className="text-[11px] text-[#9C97BE] mb-1">
                                                {activeConversation
                                                    ? authorLabel(
                                                          m,
                                                          activeConversation,
                                                      )
                                                    : ""}{" "}
                                                · {m.time}
                                            </span>
                                            <div
                                                className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap wrap-break-word ${
                                                    m.mine
                                                        ? "bg-[#6C4FE0] text-white rounded-br-sm"
                                                        : "bg-[#F6F7FB] text-[#171139] rounded-bl-sm"
                                                }`}
                                            >
                                                {m.text}
                                            </div>
                                        </div>
                                    ),
                                )}
                                {pendingText !== null && (
                                    <div className="flex flex-col items-end">
                                        <div className="max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap wrap-break-word bg-[#6C4FE0] text-white rounded-br-sm opacity-80">
                                            {pendingText}
                                        </div>
                                    </div>
                                )}
                                {isStreaming && (
                                    <AssistantMessage
                                        text={streamingText}
                                        label="AI Assistant"
                                        streaming
                                        placeholder={<TypingDots />}
                                    />
                                )}
                                <div ref={bottomRef} />
                            </div>
                        ) : isMentee ? (
                            <div className="h-full flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto">
                                <div className="w-12 h-12 rounded-full bg-[#FEF4EC] text-[#E07830] flex items-center justify-center">
                                    <SparkleIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-[#171139]">
                                        How can I help today?
                                    </p>
                                    <p className="text-sm text-[#6B6690] mt-1">
                                        You&apos;re chatting with the AI
                                        assistant. Ask for a human mentor at any
                                        time and the first available mentor will
                                        pick up this chat.
                                    </p>
                                </div>
                                {!activeConversation && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {SUGGESTIONS.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setDraft(s)}
                                                className="text-xs text-[#6C4FE0] bg-[#F3EFFF] px-3 py-1.5 rounded-full hover:bg-[#E4DBFF] transition-colors"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center gap-2 px-6">
                                <HistoryIcon className="w-6 h-6 text-[#9C97BE]" />
                                <p className="text-sm text-[#6B6690]">
                                    {isMentor
                                        ? "Pick an open request or one of your chats from the history."
                                        : "Pick a mentor request to pair the mentee with a mentor, or open an escalated chat."}
                                </p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="px-5 py-2 text-xs text-[#D14343] border-t border-[#EDEBF6]">
                            {error}
                        </p>
                    )}

                    {isMentee &&
                        activeConversation?.status === "ESCALATED" &&
                        !activeConversation.mentorId && (
                            <p className="px-5 py-2 text-xs text-[#9C97BE] border-t border-[#EDEBF6]">
                                Your request is with our mentors. The first one
                                available will join — you can keep adding
                                details here in the meantime.
                            </p>
                        )}

                    {canCompose && (
                        <form
                            onSubmit={handleSend}
                            className="flex items-center gap-3 px-4 sm:px-5 py-4 border-t border-[#EDEBF6] shrink-0"
                        >
                            <input
                                type="text"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder={
                                    talkingToAi
                                        ? "Message the AI assistant..."
                                        : "Type a message..."
                                }
                                disabled={isStreaming}
                                className="flex-1 min-w-0 text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                aria-label="Send message"
                                disabled={
                                    isPending || isStreaming || !draft.trim()
                                }
                                className="w-9 h-9 rounded-full bg-[#6C4FE0] flex items-center justify-center text-white hover:bg-[#5B3FD6] transition-colors shrink-0 disabled:opacity-60"
                            >
                                <SendIcon className="w-4 h-4" />
                            </button>
                        </form>
                    )}
                </section>

                {/* Mobile backdrop for the history drawer */}
                {historyOpen && (
                    <button
                        type="button"
                        aria-label="Close chat history"
                        onClick={() => setHistoryOpen(false)}
                        className="lg:hidden absolute inset-0 z-10 bg-[#171139]/20"
                    />
                )}

                {/* History sidebar: static on the right on desktop, slide-in drawer on mobile */}
                <aside
                    id="chat-history"
                    className={`absolute inset-y-0 right-0 z-20 w-full sm:w-80 lg:static lg:z-auto lg:w-80 lg:shrink-0 lg:translate-x-0 lg:visible bg-white rounded-2xl border border-[#EDEBF6] flex flex-col min-h-0 transition-[transform,visibility] duration-300 ease-out ${
                        historyOpen
                            ? "translate-x-0 visible"
                            : "translate-x-full invisible"
                    }`}
                >
                    <div className="p-3 border-b border-[#EDEBF6] shrink-0 flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                            <p className="text-[11px] font-bold text-[#9C97BE] uppercase tracking-wide">
                                Chat history
                            </p>
                            <button
                                type="button"
                                onClick={() => setHistoryOpen(false)}
                                aria-label="Close chat history"
                                className="lg:hidden w-8 h-8 -mr-1 rounded-full flex items-center justify-center text-[#6B6690] hover:bg-[#F6F7FB]"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {isMentee && (
                            <Link
                                href="/chats"
                                onClick={() => setHistoryOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#6C4FE0] text-white text-sm font-semibold hover:bg-[#5B3FD6] transition-colors"
                            >
                                <PlusIcon className="w-4 h-4" />
                                New chat
                            </Link>
                        )}

                        <div className="relative">
                            <SearchIcon className="w-4 h-4 text-[#9C97BE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search chats..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDEBF6] bg-[#F6F7FB] text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0]"
                            />
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
                        {filtered.length === 0 ? (
                            <p className="text-center text-xs text-[#9C97BE] px-4 py-8">
                                {query
                                    ? "No chats match your search."
                                    : isMentee
                                      ? "Your AI chats will appear here."
                                      : "No mentee requests yet."}
                            </p>
                        ) : isAdmin ? (
                            <>
                                {escalatedChats.length > 0 && (
                                    <p className="px-3 pt-2 pb-1 text-[11px] font-bold text-[#D14343] uppercase tracking-wide">
                                        Escalated to admin
                                    </p>
                                )}
                                {escalatedChats.map(renderConversationLink)}
                                {openRequests.length > 0 && (
                                    <p className="px-3 pt-3 pb-1 text-[11px] font-bold text-[#9C97BE] uppercase tracking-wide">
                                        Unassigned
                                    </p>
                                )}
                                {openRequests.map(renderConversationLink)}
                                {assignedChats.length > 0 && (
                                    <p className="px-3 pt-3 pb-1 text-[11px] font-bold text-[#9C97BE] uppercase tracking-wide">
                                        With a mentor
                                    </p>
                                )}
                                {assignedChats.map(renderConversationLink)}
                            </>
                        ) : isMentor ? (
                            <>
                                {openRequests.length > 0 && (
                                    <p className="px-3 pt-2 pb-1 text-[11px] font-bold text-[#9C97BE] uppercase tracking-wide">
                                        Open requests
                                    </p>
                                )}
                                {openRequests.map(renderConversationLink)}
                                {ownChats.length > 0 && (
                                    <p className="px-3 pt-3 pb-1 text-[11px] font-bold text-[#9C97BE] uppercase tracking-wide">
                                        Your chats
                                    </p>
                                )}
                                {ownChats.map(renderConversationLink)}
                            </>
                        ) : (
                            filtered.map(renderConversationLink)
                        )}
                    </nav>
                </aside>
            </div>
        </div>
    )
}
