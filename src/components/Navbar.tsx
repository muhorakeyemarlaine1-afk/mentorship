"use client"

import Link from "next/link"
import { useState } from "react"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

const NAV_LINKS = [
    { label: "Home", href: "/#home" },
    { label: "Our Mentors", href: "/mentors" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Impact", href: "/#impact" },
    { label: "Stories", href: "/#stories" },
    { label: "Join Us", href: "/#join" },
]

interface NavbarProps {
    search?: string
    onSearchChange?: (value: string) => void
    filterAvailable?: boolean
    onToggleFilter?: () => void
}

export function Navbar({
    search,
    onSearchChange,
    filterAvailable,
    onToggleFilter,
}: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const showMentorFilters = onSearchChange !== undefined

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-[#E2EAF4]">
            <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
                <div className="flex items-center gap-6 min-w-0">
                    <Link
                        href="/"
                        className="flex items-center gap-3 flex-shrink-0"
                    >
                        <img
                            src={LOGO_URL}
                            alt="Global Youth Emerge"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    <div className="hidden lg:flex items-end gap-7 -mb-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-xs font-bold text-[#4A6080] hover:text-[#1B4B8A] transition-colors whitespace-nowrap uppercase"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <button className="hidden md:block text-sm font-semibold text-[#1B4B8A] hover:underline">
                        Sign In
                    </button>
                    <Link
                        href="/#join"
                        className="bg-[#E07830] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#C96820] transition-all hover:scale-105 active:scale-100 shadow-sm"
                    >
                        Get Started Free
                    </Link>
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5 text-[#1B4B8A]"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    d="M6 6l12 12M6 18L18 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            ) : (
                                <path
                                    d="M4 6h16M4 12h16M4 18h16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-[#E2EAF4] px-5 py-4 flex flex-col gap-3">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-[#0D1F3C] py-1"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {showMentorFilters && (
                        <>
                            <input
                                type="text"
                                placeholder="Search mentors…"
                                value={search}
                                onChange={(e) =>
                                    onSearchChange?.(e.target.value)
                                }
                                className="w-full px-4 py-2.5 rounded-full border border-[#D9E5F5] text-sm focus:outline-none focus:border-[#1B4B8A]"
                            />
                            <button
                                onClick={onToggleFilter}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium w-fit"
                                style={{
                                    borderColor: filterAvailable
                                        ? "#1B4B8A"
                                        : "#D9E5F5",
                                    backgroundColor: filterAvailable
                                        ? "#EEF3FA"
                                        : "white",
                                    color: filterAvailable
                                        ? "#1B4B8A"
                                        : "#6B84A3",
                                }}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${filterAvailable ? "bg-[#1B4B8A]" : "bg-[#D1D5DB]"}`}
                                />
                                Available Now
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}
