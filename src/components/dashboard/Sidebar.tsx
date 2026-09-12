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

function buildMainNav(
    role: "ADMIN" | "MENTOR" | "MENTEE",
    unreadMessages: number,
): NavItem[] {
    const items: NavItem[] = [
        { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
    ]

    if (role === "ADMIN") {
        items.push(
            { label: "Mentors", href: "/mentors", icon: UsersIcon },
            { label: "Mentees", href: "/mentees", icon: UserIcon },
        )
    }

    items.push(
        {
            label: "AI Matchmaking",
            href: "/ai-matchmaking",
            icon: SparkleIcon,
        },
        { label: "Sessions", href: "/sessions", icon: CalendarIcon },
        {
            label: "Chats",
            href: "/chats",
            icon: ChatIcon,
            badge: unreadMessages || undefined,
        },
        { label: "Programs", href: "/programs", icon: BookOpenIcon },
    )

    if (role === "ADMIN") {
        items.push(
            {
                label: "Reports & Analytics",
                href: "/reports",
                icon: BarChartIcon,
            },
            { label: "Settings", href: "/settings", icon: SettingsIcon },
        )
    }

    return items
}

function buildAdminNav(pendingApplications: number): NavItem[] {
    return [
        {
            label: "Users & Roles",
            href: "/users-roles",
            icon: ShieldIcon,
            badge: pendingApplications || undefined,
        },
        { label: "Billing & Plans", href: "/billing", icon: CreditCardIcon },
        { label: "Audit Logs", href: "/audit-logs", icon: FileTextIcon },
    ]
}

function NavRow({ item, active }: { item: NavItem; active: boolean }) {
    const Icon = item.icon
    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-3.5 mb-1 text-sm font-medium transition-colors ${
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

export function Sidebar({
    user,
    unreadMessages = 0,
    pendingApplications = 0,
}: {
    user: SidebarUser
    unreadMessages?: number
    pendingApplications?: number
}) {
    const pathname = usePathname()

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`)

    const mainNav = buildMainNav(user.role, unreadMessages)
    const adminNav = buildAdminNav(pendingApplications)

    return (
        <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#1C1440] text-white">
            <div className="flex items-center gap-3 px-5 h-20 shrink-0 border-b border-white/10">
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

            <nav className="flex-1 overflow-y-auto py-2 flex flex-col gap-1">
                {mainNav.map((item) => (
                    <NavRow
                        key={item.href}
                        item={item}
                        active={isActive(item.href)}
                    />
                ))}

                {/* {user.role === "ADMIN" && (
                    <>
                        <div className="h-px bg-white/10 my-3 mx-1" />

                        {adminNav.map((item) => (
                            <NavRow
                                key={item.href}
                                item={item}
                                active={isActive(item.href)}
                            />
                        ))}
                    </>
                )} */}
            </nav>

            {/* <div className="shrink-0 p-3 border-t border-white/10">
                <Link
                    href="/settings"
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                    <div className="w-9 h-9 rounded-full bg-[#6C4FE0]/30 flex items-center justify-center font-bold text-sm text-white shrink-0">
                        {(user.name ?? user.email ?? "?")[0]?.toUpperCase()}
                    </div>
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
                </Link>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="w-full mt-1 flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-[#B4ADD4] hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <LogoutIcon className="w-4.5 h-4.5" />
                        Logout
                    </button>
                </form>
            </div> */}
        </aside>
    )
}
