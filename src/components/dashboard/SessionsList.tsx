"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { PlusIcon, SearchIcon } from "@/components/dashboard/icons"

export interface SessionListItem {
    id: string
    mentorName: string
    menteeName: string
    scheduledAt: string
    durationMinutes: number
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED"
}

const STATUS_STYLES: Record<SessionListItem["status"], string> = {
    SCHEDULED: "bg-[#E7F0FF] text-[#3167E0]",
    COMPLETED: "bg-[#E6F7EE] text-[#1BA766]",
    CANCELLED: "bg-[#FDECEA] text-[#B71C1C]",
}

export function SessionsList({ sessions }: { sessions: SessionListItem[] }) {
    const [search, setSearch] = useState("")

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return sessions
        return sessions.filter((s) =>
            [s.mentorName, s.menteeName]
                .join(" ")
                .toLowerCase()
                .includes(query)
        )
    }, [sessions, search])

    return (
        <div>
            <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#171139]">
                        Sessions
                    </h1>
                    <p className="text-sm text-[#6B6690] mt-1">
                        {sessions.length} session
                        {sessions.length === 1 ? "" : "s"} scheduled.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <SearchIcon className="w-4 h-4 text-[#9C97BE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search sessions..."
                            className="pl-10 pr-4 py-2.5 rounded-full border border-[#E5E3F1] bg-white text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0] w-64"
                        />
                    </div>
                    <Link
                        href="/sessions/new"
                        className="flex items-center gap-2 bg-[#6C4FE0] text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#5B3FD6] transition-colors shadow-sm shadow-[#6C4FE0]/30"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Schedule Session
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] overflow-hidden overflow-x-auto">
                {filtered.length === 0 ? (
                    <div className="px-6 py-16 text-center text-sm text-[#6B6690]">
                        {sessions.length === 0
                            ? "No sessions yet. Schedule the first one."
                            : "No sessions match your search."}
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#EDEBF6]">
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Mentor
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Mentee
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    When
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Duration
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s) => (
                                <tr
                                    key={s.id}
                                    className="border-b border-[#EDEBF6] last:border-0 hover:bg-[#F6F7FB] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/sessions/${s.id}`}
                                            className="text-sm font-semibold text-[#171139] hover:underline"
                                        >
                                            {s.mentorName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#6B6690]">
                                        {s.menteeName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#6B6690]">
                                        {new Date(
                                            s.scheduledAt
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#6B6690]">
                                        {s.durationMinutes} min
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[s.status]}`}
                                        >
                                            {s.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
