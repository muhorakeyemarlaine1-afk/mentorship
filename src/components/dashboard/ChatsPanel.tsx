"use client"

import Link from "next/link"
import { useRef, useState, useTransition } from "react"

import { sendMessageAction } from "@/actions/messages"
import { SearchIcon, SendIcon, SparkleIcon } from "@/components/dashboard/icons"

export interface ChatPerson {
    id: string
    name: string
    email: string
    role: "MENTOR" | "MENTEE"
    preview: string | null
    time: string | null
    unread: number
}

export interface ChatMessage {
    id: string
    fromMe: boolean
    text: string
    time: string
}

const ROLE_STYLES: Record<ChatPerson["role"], string> = {
    MENTOR: "bg-[#EFEAFF] text-[#6C4FE0]",
    MENTEE: "bg-[#E6F7EE] text-[#1BA766]",
}

export function ChatsPanel({
    people,
    activePerson,
    messages,
}: {
    people: ChatPerson[]
    activePerson: ChatPerson | null
    messages: ChatMessage[]
}) {
    const [search, setSearch] = useState("")
    const [draft, setDraft] = useState("")
    const [isPending, startTransition] = useTransition()
    const formRef = useRef<HTMLFormElement>(null)

    const filtered = people.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!activePerson || !draft.trim()) return
        const content = draft
        setDraft("")
        startTransition(async () => {
            await sendMessageAction(activePerson.id, content)
        })
    }

    return (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 px-8 pb-6">
            <div className="bg-white rounded-2xl border border-[#EDEBF6] flex flex-col min-h-0">
                <div className="p-3 shrink-0">
                    <div className="relative">
                        <SearchIcon className="w-4 h-4 text-[#9C97BE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search people..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDEBF6] bg-[#F6F7FB] text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0]"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-2">
                    {filtered.length === 0 ? (
                        <p className="text-center text-xs text-[#9C97BE] px-4 py-8">
                            No mentors or mentees yet.
                        </p>
                    ) : (
                        filtered.map((p) => (
                            <Link
                                key={p.id}
                                href={`/chats?with=${p.id}`}
                                className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                                    activePerson?.id === p.id
                                        ? "bg-[#F3EFFF]"
                                        : "hover:bg-[#F6F7FB]"
                                }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-[#EFEAFF] text-[#6C4FE0] flex items-center justify-center font-bold text-sm shrink-0">
                                    {p.name[0]?.toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <p className="text-sm font-semibold text-[#171139] truncate">
                                                {p.name}
                                            </p>
                                            <span
                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${ROLE_STYLES[p.role]}`}
                                            >
                                                {p.role}
                                            </span>
                                        </div>
                                        {p.time && (
                                            <span className="text-[11px] text-[#9C97BE] shrink-0">
                                                {p.time}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs text-[#6B6690] truncate">
                                            {p.preview ?? "No messages yet"}
                                        </p>
                                        {p.unread > 0 && (
                                            <span className="bg-[#6C4FE0] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                                                {p.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] flex flex-col min-h-0">
                {!activePerson ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-2">
                        <SparkleIcon className="w-6 h-6 text-[#9C97BE]" />
                        <p className="text-sm text-[#6B6690]">
                            Select a mentor or mentee to start chatting.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDEBF6] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#EFEAFF] text-[#6C4FE0] flex items-center justify-center font-bold text-sm">
                                    {activePerson.name[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-[#171139]">
                                            {activePerson.name}
                                        </p>
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLES[activePerson.role]}`}
                                        >
                                            {activePerson.role}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#6B6690]">
                                        {activePerson.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {messages.length === 0 ? (
                                <p className="text-center text-xs text-[#9C97BE]">
                                    No messages yet. Say hello 👋
                                </p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`flex flex-col ${m.fromMe ? "items-end" : "items-start"}`}
                                        >
                                            <span className="text-[11px] text-[#9C97BE] mb-1">
                                                {m.time}
                                            </span>
                                            <div
                                                className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                                                    m.fromMe
                                                        ? "bg-[#6C4FE0] text-white rounded-br-sm"
                                                        : "bg-[#F6F7FB] text-[#171139] rounded-bl-sm"
                                                }`}
                                            >
                                                {m.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form
                            ref={formRef}
                            onSubmit={handleSend}
                            className="flex items-center gap-3 px-5 py-4 border-t border-[#EDEBF6] shrink-0"
                        >
                            <input
                                type="text"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={isPending || !draft.trim()}
                                className="w-9 h-9 rounded-full bg-[#6C4FE0] flex items-center justify-center text-white hover:bg-[#5B3FD6] transition-colors shrink-0 disabled:opacity-60"
                            >
                                <SendIcon className="w-4 h-4" />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
