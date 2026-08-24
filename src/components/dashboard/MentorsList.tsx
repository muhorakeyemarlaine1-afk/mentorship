"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { SearchIcon, PlusIcon } from "@/components/dashboard/icons"

export interface MentorListItem {
    id: string
    name: string | null
    email: string
    title: string | null
    isActive: boolean
    createdAt: string
}

export function MentorsList({ mentors }: { mentors: MentorListItem[] }) {
    const [search, setSearch] = useState("")

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return mentors
        return mentors.filter((mentor) =>
            [mentor.name, mentor.email, mentor.title]
                .filter(Boolean)
                .some((field) => field!.toLowerCase().includes(query))
        )
    }, [mentors, search])

    return (
        <div>
            <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#171139]">
                        Mentors
                    </h1>
                    <p className="text-sm text-[#6B6690] mt-1">
                        {mentors.length} mentor
                        {mentors.length === 1 ? "" : "s"} on the platform.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <SearchIcon className="w-4 h-4 text-[#9C97BE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search mentors..."
                            className="pl-10 pr-4 py-2.5 rounded-full border border-[#E5E3F1] bg-white text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0] w-64"
                        />
                    </div>

                    <Link
                        href="/mentors/new"
                        className="flex items-center gap-2 bg-[#6C4FE0] text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#5B3FD6] transition-colors shadow-sm shadow-[#6C4FE0]/30"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Mentor
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="px-6 py-16 text-center text-sm text-[#6B6690]">
                        {mentors.length === 0
                            ? "No mentors yet. Add your first mentor to get started."
                            : "No mentors match your search."}
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#EDEBF6]">
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Mentor
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Title
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Joined
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((mentor) => (
                                <tr
                                    key={mentor.id}
                                    className="border-b border-[#EDEBF6] last:border-0 hover:bg-[#F6F7FB] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/mentors/${mentor.id}`}
                                            className="flex items-center gap-3 min-w-0"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-[#EFEAFF] text-[#6C4FE0] flex items-center justify-center font-bold text-sm shrink-0">
                                                {(mentor.name ??
                                                    mentor.email)[0]?.toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-[#171139] truncate">
                                                    {mentor.name ??
                                                        "Unnamed mentor"}
                                                </p>
                                                <p className="text-xs text-[#6B6690] truncate">
                                                    {mentor.email}
                                                </p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#6B6690]">
                                        {mentor.title ?? "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                mentor.isActive
                                                    ? "bg-[#E6F7EE] text-[#1BA766]"
                                                    : "bg-[#F1F0FA] text-[#6B6690]"
                                            }`}
                                        >
                                            {mentor.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#6B6690]">
                                        {new Date(
                                            mentor.createdAt
                                        ).toLocaleDateString()}
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
