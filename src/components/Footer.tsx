import Link from "next/link"
import type { ReactNode } from "react"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

const FOOTER_LINKS = [
    { label: "Home", href: "/" },
    { label: "Explore Mentorship", href: "/explore-mentorship" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Join Us", href: "/get-started" },
]

const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/107663137/",
        icon: (
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
        ),
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/globalyouthemerge/",
        icon: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.2" />
            </>
        ),
    },
    {
        label: "Facebook",
        href: "https://www.facebook.com/share/16vGQG6CZx/",
        icon: (
            <path d="M13.5 21v-7.6h2.56l.38-2.97H13.5v-1.9c0-.86.24-1.44 1.47-1.44h1.57V4.43a21 21 0 00-2.29-.12c-2.27 0-3.82 1.38-3.82 3.93v2.2H7.87v2.96h2.56V21h3.07z" />
        ),
    },
]

export function Footer({ className = "" }: { className?: string }) {
    return (
        <footer className={`bg-[#0D1F3C] text-white py-8 ${className}`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <img
                        src={LOGO_URL}
                        alt="Global Youth Emerge"
                        className="h-12 w-auto bg-white rounded-lg p-1"
                    />
                    <div>
                        <div className="font-extrabold text-sm uppercase">
                            Global Youth Emerge
                        </div>
                        <div className="text-xs text-[#9CAFC8]">
                            Empowering Africa&apos;s youth, one mentor at a
                            time.
                        </div>
                    </div>
                </div>

                <nav className="flex flex-wrap justify-center items-center text-sm">
                    {FOOTER_LINKS.map((link, i) => (
                        <span key={link.label} className="flex items-center">
                            {i > 0 && (
                                <span className="mx-3 text-white/30">|</span>
                            )}
                            <Link
                                href={link.href}
                                className="text-white/90 hover:text-[#F28A3C] transition-colors"
                            >
                                {link.label}
                            </Link>
                        </span>
                    ))}
                </nav>

                <div className="flex gap-3">
                    {SOCIALS.map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                            >
                                {s.icon}
                            </svg>
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
