"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { PlusIcon, SearchIcon } from "@/components/dashboard/icons"

export interface ProgramListItem {
    id: string
    title: string
    category: string | null
    status: "ACTIVE" | "DRAFT" | "ARCHIVED"
    createdAt: string
}

const STATUS_STYLES: Record<ProgramListItem["status"], string> = {
    ACTIVE: "bg-[#E6F7EE] text-[#1BA766]",
    DRAFT: "bg-[#F1F0FA] text-[#6B6690]",
    ARCHIVED: "bg-[#FDECEA] text-[#B71C1C]",
}

export function ProgramsList({
    programs,
    canManage = true,
}: {
    programs: ProgramListItem[]
    canManage?: boolean
}) {
    const [search, setSearch] = useState("")

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return programs
        return programs.filter((p) =>
            [p.title, p.category].filter(Boolean).some((f) =>
                f!.toLowerCase().includes(query)
            )
        )
    }, [programs, search])

    return (
        <div>
            <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#171139]">
                        Programs
                    </h1>
                    <p className="text-sm text-[#6B6690] mt-1">
                        {programs.length} program
                        {programs.length === 1 ? "" : "s"}.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <SearchIcon className="w-4 h-4 text-[#9C97BE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search programs..."
                            className="pl-10 pr-4 py-2.5 rounded-full border border-[#E5E3F1] bg-white text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0] w-64"
                        />
                    </div>
                    {canManage && (
                        <Link
                            href="/programs/new"
                            className="flex items-center gap-2 bg-[#6C4FE0] text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#5B3FD6] transition-colors shadow-sm shadow-[#6C4FE0]/30"
                        >
                            <PlusIcon className="w-4 h-4" />
                            New Program
                        </Link>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#EDEBF6] px-6 py-16 text-center text-sm text-[#6B6690]">
                    {programs.length === 0
                        ? "No programs yet. Create the first one."
                        : "No programs match your search."}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((p) => (
                        <Link
                            key={p.id}
                            href={`/programs/${p.id}`}
                            className="bg-white rounded-2xl border border-[#EDEBF6] p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-sm font-bold text-[#171139]">
                                    {p.title}
                                </h3>
                                <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[p.status]}`}
                                >
                                    {p.status}
                                </span>
                            </div>
                            {p.category && (
                                <p className="text-xs text-[#6C4FE0] font-semibold mb-2">
                                    {p.category}
                                </p>
                            )}
                            <p className="text-xs text-[#9C97BE]">
                                Created{" "}
                                {new Date(p.createdAt).toLocaleDateString()}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
