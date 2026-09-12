"use client"

import Link from "next/link"
import { useState } from "react"

import { Navbar } from "@/components/Navbar"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

export interface PublicMentor {
    id: string
    name: string
    title: string | null
    bio: string | null
    image: string | null
    available: boolean
}

function MentorCard({ mentor }: { mentor: PublicMentor }) {
    return (
        <div className="rounded-2xl overflow-hidden border border-[#E2EAF4] bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="relative h-40 bg-[#EEF3FA] flex items-center justify-center">
                {mentor.image ? (
                    <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-[#1B4B8A]/10 text-[#1B4B8A] flex items-center justify-center font-extrabold text-2xl">
                        {mentor.name[0]?.toUpperCase()}
                    </div>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: mentor.available
                                ? "#DCFCE7"
                                : "#F3F4F6",
                            color: mentor.available ? "#15803D" : "#6B7280",
                        }}
                    >
                        {mentor.available ? "● Available" : "○ Busy"}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-bold text-[#0D1F3C] text-base">
                    {mentor.name}
                </h3>
                {mentor.title && (
                    <p
                        className="text-sm text-[#1B4B8A] mt-0.5 mb-3"
                    >
                        {mentor.title}
                    </p>
                )}
                {mentor.bio && (
                    <p
                        className="text-[#4A6080] text-sm leading-relaxed mb-4 line-clamp-3"
                    >
                        {mentor.bio}
                    </p>
                )}

                {mentor.available ? (
                    <Link
                        href="/get-started"
                        className="w-full py-2.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02] flex items-center justify-center bg-[#1B4B8A] text-white"
                    >
                        Book a Session
                    </Link>
                ) : (
                    <button
                        className="w-full py-2.5 rounded-full text-sm font-bold transition-all bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
                        disabled
                    >
                        Join Waitlist
                    </button>
                )}
            </div>
        </div>
    )
}

export function MentorsBrowser({ mentors }: { mentors: PublicMentor[] }) {
    const [search, setSearch] = useState("")
    const [filterAvailable, setFilterAvailable] = useState(false)

    const filteredMentors = mentors.filter((m) => {
        const query = search.toLowerCase()
        const matchSearch =
            !query ||
            m.name.toLowerCase().includes(query) ||
            (m.title?.toLowerCase().includes(query) ?? false) ||
            (m.bio?.toLowerCase().includes(query) ?? false)
        const matchAvailable = !filterAvailable || m.available
        return matchSearch && matchAvailable
    })

    const availableCount = mentors.filter((m) => m.available).length

    return (
        <div
            className="min-h-screen bg-white"
        >
            <Navbar
                search={search}
                onSearchChange={setSearch}
                filterAvailable={filterAvailable}
                onToggleFilter={() => setFilterAvailable(!filterAvailable)}
            />

            <div className="pt-16 bg-[#0D2B5E] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#1B4B8A]/60 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#E07830]/10 -translate-x-1/3 translate-y-1/3" />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 py-10">
                    <div className="text-[#E07830] text-xs font-bold uppercase tracking-widest mb-2">
                        mentorship.globalyouthemerge.org
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                        Find Your Mentor
                    </h1>
                    <p
                        className="text-blue-200 text-base"
                    >
                        Browse {mentors.length} expert mentors across every
                        area of your growth.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#0D1F3C] mb-1">
                            Our Mentors
                        </h2>
                        <p
                            className="text-[#6B84A3] text-sm"
                        >
                            {availableCount} available now ·{" "}
                            {mentors.length} total mentors
                        </p>
                    </div>
                    {search && (
                        <div className="text-sm text-[#6B84A3]">
                            {filteredMentors.length} result
                            {filteredMentors.length !== 1 ? "s" : ""} for
                            &ldquo;{search}&rdquo;
                        </div>
                    )}
                </div>

                {filteredMentors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMentors.map((mentor) => (
                            <MentorCard key={mentor.id} mentor={mentor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 text-[#9CAFC8]">
                        <svg
                            viewBox="0 0 64 64"
                            fill="none"
                            className="w-16 h-16 mx-auto mb-4 opacity-40"
                        >
                            <circle
                                cx="28"
                                cy="28"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                d="M44 44l12 12"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <p className="text-lg font-semibold">
                            {mentors.length === 0
                                ? "No mentors yet"
                                : "No mentors found"}
                        </p>
                        <p
                            className="text-sm mt-1"
                        >
                            {mentors.length === 0
                                ? "Check back soon — new mentors join regularly."
                                : "Try adjusting your search or clearing the available filter."}
                        </p>
                        {mentors.length > 0 && (
                            <button
                                onClick={() => {
                                    setSearch("")
                                    setFilterAvailable(false)
                                }}
                                className="mt-4 px-6 py-2 rounded-full border border-[#D9E5F5] text-sm font-medium text-[#1B4B8A] hover:bg-[#EEF3FA] transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            <footer className="bg-[#0D1F3C] text-white py-8 mt-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={LOGO_URL}
                            alt="Global Youth Emerge"
                            className="h-8 w-auto brightness-0 invert"
                        />
                        <span
                            className="text-[#6B84A3] text-sm"
                        >
                            © 2025 Global Youth Emerge ·
                            mentorship.globalyouthemerge.org
                        </span>
                    </div>
                    <div className="flex gap-5">
                        {["Privacy", "Terms", "Contact"].map((l) => (
                            <a
                                key={l}
                                href="#"
                                className="text-[#6B84A3] text-xs hover:text-white transition-colors"
                            >
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
