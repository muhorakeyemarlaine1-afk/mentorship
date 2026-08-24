"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutAction } from "@/actions/auth"
import {
    HomeIcon,
    UsersIcon,
    UserIcon,
    SparkleIcon,
    CalendarIcon,
    ChatIcon,
    BookOpenIcon,
    BarChartIcon,
    BellIcon,
    SettingsIcon,
    ShieldIcon,
    CreditCardIcon,
    FileTextIcon,
    ChevronDownIcon,
    LogoutIcon,
} from "@/components/dashboard/icons"

interface NavItem {
    label: string
    href: string
    icon: (props: { className?: string }) => React.ReactNode
    badge?: number
}

const MAIN_NAV: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { label: "Mentors", href: "/mentors", icon: UsersIcon },
    { label: "Mentees", href: "/mentees", icon: UserIcon },
    { label: "AI Matchmaking", href: "/ai-matchmaking", icon: SparkleIcon },
    { label: "Sessions", href: "/sessions", icon: CalendarIcon },
    { label: "Chats", href: "/chats", icon: ChatIcon, badge: 23 },
    { label: "Programs", href: "/programs", icon: BookOpenIcon },
    { label: "Reports & Analytics", href: "/reports", icon: BarChartIcon },
    { label: "Notifications", href: "/notifications", icon: BellIcon, badge: 5 },
    { label: "Settings", href: "/settings", icon: SettingsIcon },
]

const ADMIN_NAV: NavItem[] = [
    { label: "Users & Roles", href: "/users-roles", icon: ShieldIcon },
    { label: "Billing & Plans", href: "/billing", icon: CreditCardIcon },
    { label: "Audit Logs", href: "/audit-logs", icon: FileTextIcon },
]

function NavRow({ item, active }: { item: NavItem; active: boolean }) {
    const Icon = item.icon
    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                    ? "bg-[#6C4FE0] text-white shadow-sm shadow-[#6C4FE0]/30"
                    : "text-[#B4ADD4] hover:bg-white/5 hover:text-white"
            }`}
        >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge ? (
                <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        active
                            ? "bg-white/20 text-white"
                            : "bg-[#6C4FE0]/20 text-[#B9A6FF]"
                    }`}
                >
                    {item.badge}
                </span>
            ) : null}
        </Link>
    )
}

interface SidebarUser {
    name?: string | null
    email?: string | null
    role: "ADMIN" | "MENTOR" | "MENTEE"
}

export function Sidebar({ user }: { user: SidebarUser }) {
    const pathname = usePathname()

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`)

    return (
        <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#1C1440] text-white">
            <div className="flex items-center gap-3 px-5 h-20 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#6C4FE0] flex items-center justify-center shrink-0">
                    <SparkleIcon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                    <p className="text-base font-extrabold leading-tight truncate">
                        MentorAI
                    </p>
                    <p className="text-[11px] text-[#8B84B8] truncate">
                        Mentorship Management
                    </p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
                {MAIN_NAV.map((item) => (
                    <NavRow
                        key={item.href}
                        item={item}
                        active={isActive(item.href)}
                    />
                ))}

                <div className="h-px bg-white/10 my-3 mx-1" />

                {ADMIN_NAV.map((item) => (
                    <NavRow
                        key={item.href}
                        item={item}
                        active={isActive(item.href)}
                    />
                ))}
            </nav>

            <div className="shrink-0 p-3 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-white/5 transition-colors">
                    <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&auto=format"
                        alt={user.name ?? "Account"}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-white truncate">
                            {user.name ?? user.email}
                        </p>
                        <p className="text-[11px] text-[#8B84B8] truncate">
                            {user.role === "ADMIN"
                                ? "Super Administrator"
                                : user.role}
                        </p>
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-[#8B84B8] shrink-0" />
                </button>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="w-full mt-1 flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-[#B4ADD4] hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <LogoutIcon className="w-4.5 h-4.5" />
                        Logout
                    </button>
                </form>
            </div>
        </aside>
    )
}
