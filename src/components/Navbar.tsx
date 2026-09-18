"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

const NAV_LINKS = [
    { label: "Home", href: "/#home" },
    { label: "Our Mentors", href: "/our-mentors" },
    { label: "How It Works", href: "/#how-it-works" },
    // { label: "Impact", href: "/#impact" },
    // { label: "Stories", href: "/#stories" },
    { label: "Join Us", href: "/get-started" },
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
    const { status } = useSession()
    const isSignedIn = status === "authenticated"

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-[#E2EAF4]">
            <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
                <div className="flex justify-between items-center gap-6 w-full">
                    <Link
                        href="/"
                        className="flex items-center gap-3 shrink-0"
                    >
                        <img
                            src={LOGO_URL}
                            alt="Global Youth Emerge"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    <Menubar className="hidden lg:flex h-auto items-center gap-1 border-none bg-transparent p-0 shadow-none">
                        {NAV_LINKS.map((link) => (
                            <MenubarMenu key={link.label}>
                                <MenubarTrigger
                                    nativeButton={false}
                                    render={<Link href={link.href} />}
                                    className="rounded-lg px-2 py-1.5 text-xs font-bold text-[#4A6080] uppercase whitespace-nowrap transition-colors hover:bg-transparent hover:text-[#1B4B8A] aria-expanded:bg-transparent"
                                >
                                    {link.label}
                                </MenubarTrigger>
                            </MenubarMenu>
                        ))}
                    </Menubar>
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
