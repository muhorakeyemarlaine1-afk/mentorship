import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
    ChatsPanel,
    type ConversationMessageView,
    type ConversationSummary,
} from "@/components/dashboard/ChatsPanel"
import { PageHeader } from "@/components/dashboard/PageHeader"

interface ChatsPageProps {
    searchParams: Promise<{ conversation?: string }>
}

function relativeTime(date: Date) {
    const diffMs = Date.now() - date.getTime()
    const minutes = Math.floor(diffMs / 60000)
    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

const PARTICIPANTS = {
    mentee: { select: { name: true, email: true } },
    mentor: { select: { name: true, email: true } },
} as const

export default async function ChatsPage({ searchParams }: ChatsPageProps) {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const { conversation: activeConversationId } = await searchParams
    const currentUserId = session.user.id
    const currentUserRole = session.user.role as "ADMIN" | "MENTOR" | "MENTEE"

    // Mentees see their own AI chats; mentors see chats handed to them plus
    // the open queue of unclaimed requests.
    const conversationsRaw =
        currentUserRole === "MENTEE"
            ? await prisma.conversation.findMany({
                  where: { menteeId: currentUserId },
                  orderBy: { updatedAt: "desc" },
                  include: PARTICIPANTS,
              })
            : currentUserRole === "MENTOR"
              ? await prisma.conversation.findMany({
                    where: {
                        status: "ESCALATED",
                        OR: [{ mentorId: currentUserId }, { mentorId: null }],
                    },
                    orderBy: { updatedAt: "desc" },
                    include: PARTICIPANTS,
                })
              : []

    const conversations: ConversationSummary[] = conversationsRaw.map((c) => ({
        id: c.id,
        title: c.title,
        menteeName: c.mentee.name ?? c.mentee.email,
        mentorId: c.mentorId,
        mentorName: c.mentor ? (c.mentor.name ?? c.mentor.email) : null,
        status: c.status,
        isOpenQueueItem:
            currentUserRole === "MENTOR" &&
            c.status === "ESCALATED" &&
            c.mentorId === null,
        time: relativeTime(c.updatedAt),
    }))

    const activeConversation =
        conversations.find((c) => c.id === activeConversationId) ?? null

    let conversationMessages: ConversationMessageView[] = []
    if (activeConversation) {
        const rows = await prisma.conversationMessage.findMany({
            where: { conversationId: activeConversation.id },
            orderBy: { createdAt: "asc" },
        })
        conversationMessages = rows.map((m) => ({
            id: m.id,
            author: m.author,
            mine: m.authorUserId === currentUserId,
            text: m.content,
            time: m.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        }))
    }

    return (
        <div className="h-[calc(100dvh-5rem)] flex flex-col">
            <PageHeader
                title={<>Chats</>}
                description={
                    <>
                        {currentUserRole === "MENTOR"
                            ? "Pick up chats mentees have handed over from the AI assistant."
                            : "Chat with the AI assistant, and bring in a mentor whenever you need one."}
                    </>
                }
            />

            <ChatsPanel
                // Remount per conversation so drafts and streaming state reset.
                key={activeConversation?.id ?? "new"}
                conversations={conversations}
                activeConversation={activeConversation}
                conversationMessages={conversationMessages}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
            />
        </div>
    )
}
