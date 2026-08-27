import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ChatsPanel, type ChatPerson } from "@/components/dashboard/ChatsPanel"

interface ChatsPageProps {
    searchParams: Promise<{ with?: string }>
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

export default async function ChatsPage({ searchParams }: ChatsPageProps) {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const { with: activeUserId } = await searchParams
    const currentUserId = session.user.id

    const people = await prisma.user.findMany({
        where: {
            id: { not: currentUserId },
            role: { in: ["MENTOR", "MENTEE"] },
        },
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true, role: true },
    })

    const allMessages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: currentUserId },
                { recipientId: currentUserId },
            ],
        },
        orderBy: { createdAt: "desc" },
    })

    const byCounterpart = new Map<string, typeof allMessages>()
    for (const message of allMessages) {
        const counterpartId =
            message.senderId === currentUserId
                ? message.recipientId
                : message.senderId
        const list = byCounterpart.get(counterpartId) ?? []
        list.push(message)
        byCounterpart.set(counterpartId, list)
    }

    const chatPeople: ChatPerson[] = people
        .map((person) => {
            const thread = byCounterpart.get(person.id) ?? []
            const last = thread[0]
            const unread = thread.filter(
                (m) => m.recipientId === currentUserId && !m.readAt
            ).length
            return {
                person: {
                    id: person.id,
                    name: person.name ?? person.email,
                    email: person.email,
                    role: person.role as "MENTOR" | "MENTEE",
                    preview: last?.content ?? null,
                    time: last ? relativeTime(last.createdAt) : null,
                    unread,
                },
                lastAt: last?.createdAt.getTime() ?? 0,
            }
        })
        .sort((a, b) => b.lastAt - a.lastAt)
        .map((row) => row.person)

    const activePersonRaw = activeUserId
        ? people.find((p) => p.id === activeUserId)
        : null

    let messages: {
        id: string
        fromMe: boolean
        text: string
        time: string
    }[] = []

    if (activePersonRaw) {
        const thread = (byCounterpart.get(activePersonRaw.id) ?? [])
            .slice()
            .reverse()
        messages = thread.map((m) => ({
            id: m.id,
            fromMe: m.senderId === currentUserId,
            text: m.content,
            time: m.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        }))

        const unreadIds = thread
            .filter((m) => m.recipientId === currentUserId && !m.readAt)
            .map((m) => m.id)
        if (unreadIds.length > 0) {
            await prisma.message.updateMany({
                where: { id: { in: unreadIds } },
                data: { readAt: new Date() },
            })
        }
    }

    return (
        <div className="h-screen flex flex-col">
            <div className="flex items-center justify-between gap-6 flex-wrap px-8 py-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#171139]">
                        Chats
                    </h1>
                    <p className="text-sm text-[#6B6690] mt-1">
                        Message mentors and mentees directly.
                    </p>
                </div>
            </div>

            <ChatsPanel
                people={chatPeople}
                activePerson={
                    activePersonRaw
                        ? {
                              id: activePersonRaw.id,
                              name: activePersonRaw.name ?? activePersonRaw.email,
                              email: activePersonRaw.email,
                              role: activePersonRaw.role as
                                  | "MENTOR"
                                  | "MENTEE",
                              preview: null,
                              time: null,
                              unread: 0,
                          }
                        : null
                }
                messages={messages}
            />
        </div>
    )
}
