import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
    ChatsPanel,
    type ConversationMessageView,
    type ConversationSummary,
    type MentorOption,
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
    admin: { select: { name: true, email: true } },
} as const

export default async function ChatsPage({ searchParams }: ChatsPageProps) {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const { conversation: activeConversationId } = await searchParams
    const currentUserId = session.user.id
    const currentUserRole = session.user.role as "ADMIN" | "MENTOR" | "MENTEE"

    // Mentees see their own AI chats; mentors see chats assigned to them plus
    // the open queue of unclaimed requests; admins see every mentor request.
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
              : await prisma.conversation.findMany({
                    where: { status: "ESCALATED" },
                    orderBy: { updatedAt: "desc" },
                    include: PARTICIPANTS,
                })

    const conversations: ConversationSummary[] = conversationsRaw.map((c) => ({
        id: c.id,
        title: c.title,
        menteeId: c.menteeId,
        menteeName: c.mentee.name ?? c.mentee.email,
        mentorId: c.mentorId,
        mentorName: c.mentor ? (c.mentor.name ?? c.mentor.email) : null,
        adminId: c.adminId,
        adminName: c.admin ? (c.admin.name ?? c.admin.email) : null,
        status: c.status,
        isOpenQueueItem: c.status === "ESCALATED" && c.mentorId === null,
        needsAdmin: c.adminEscalatedAt !== null,
        // Only staff see why a mentor escalated.
        escalationNote:
            currentUserRole === "MENTEE" ? null : c.adminEscalationNote,
        time: relativeTime(c.updatedAt),
    }))

    // Admins pair mentees with mentors; flag mentors already matched with
    // each mentee so they're easy to pick.
    let mentorOptions: MentorOption[] = []
    if (currentUserRole === "ADMIN") {
        const mentors = await prisma.user.findMany({
            where: { role: "MENTOR", isActive: true },
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                email: true,
                title: true,
                mentorMatches: {
                    where: { status: "ACCEPTED" },
                    select: { menteeId: true },
                },
                _count: {
                    select: {
                        mentorConversations: { where: { status: "ESCALATED" } },
                    },
                },
            },
        })
        mentorOptions = mentors.map((m) => ({
            id: m.id,
            name: m.name ?? m.email,
            title: m.title,
            activeChats: m._count.mentorConversations,
            matchedMenteeIds: m.mentorMatches.map((match) => match.menteeId),
        }))
    }

    const activeConversation =
        conversations.find((c) => c.id === activeConversationId) ?? null

    let conversationMessages: ConversationMessageView[] = []
    if (activeConversation) {
        const rows = await prisma.conversationMessage.findMany({
            where: { conversationId: activeConversation.id },
            orderBy: { createdAt: "asc" },
        })
        // Name each message by who sent it: the assigned mentor can change.
        const authorIds = [
            ...new Set(rows.flatMap((m) => (m.authorUserId ? [m.authorUserId] : []))),
        ]
        const authors = await prisma.user.findMany({
            where: { id: { in: authorIds } },
            select: { id: true, name: true, email: true },
        })
        const authorNames = new Map(authors.map((a) => [a.id, a.name ?? a.email]))
        conversationMessages = rows.map((m) => ({
            id: m.id,
            author: m.author,
            authorName: m.authorUserId
                ? (authorNames.get(m.authorUserId) ?? null)
                : null,
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
                        {currentUserRole === "ADMIN"
                            ? "Pair mentees with mentors, and step in on chats mentors escalate."
                            : currentUserRole === "MENTOR"
                              ? "Pick up open requests from mentees, and escalate to an admin when you need help."
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
                mentorOptions={mentorOptions}
            />
        </div>
    )
}
