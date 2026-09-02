"use client"

import Link from "next/link"
import {
    UsersIcon,
    UserIcon,
    SparkleIcon,
    CalendarIcon,
    ArrowUpRightIcon,
    BookOpenIcon,
    BarChartIcon,
    SettingsIcon,
} from "@/components/dashboard/icons"

export interface DashboardStats {
    totalMentors: number
    totalMentees: number
    activeMatches: number
    sessionsCompleted: number
    unmatchedMentees: number
}

export interface RecentPerson {
    id: string
    name: string
    role: string
    href: string
    isActive: boolean
}

export interface RecentActivityItem {
    id: string
    action: string
    detail: string | null
    createdAt: string
}

export interface RecentMessageItem {
    id: string
    counterpartName: string
    preview: string
    time: string
}

export function DashboardContent({
    adminName,
    isAdmin,
    stats,
    matchRate,
    recentActivity,
    recentMentors,
    recentMentees,
    recentMessages,
    pendingApplications,
}: {
    adminName: string
    isAdmin: boolean
    stats: DashboardStats
    matchRate: number
    recentActivity: RecentActivityItem[]
    recentMentors: RecentPerson[]
    recentMentees: RecentPerson[]
    recentMessages: RecentMessageItem[]
    pendingApplications: number
}) {
    const STAT_CARDS = [
        {
            label: "Total Mentors",
            value: stats.totalMentors,
            icon: UserIcon,
            bg: "#EFEAFF",
            color: "#6C4FE0",
        },
        {
            label: "Total Mentees",
            value: stats.totalMentees,
            icon: UsersIcon,
            bg: "#E6F7EE",
            color: "#1BA766",
        },
        {
            label: "Active Matches",
            value: stats.activeMatches,
            icon: UsersIcon,
            bg: "#FFEEE1",
            color: "#E0793F",
        },
        {
            label: "Sessions Completed",
            value: stats.sessionsCompleted,
            icon: CalendarIcon,
            bg: "#E7F0FF",
            color: "#3167E0",
        },
        {
            label: "Unmatched Mentees",
            value: stats.unmatchedMentees,
            icon: SparkleIcon,
            bg: "#F3EAFF",
            color: "#9B4FE0",
        },
    ]

    const QUICK_ACTIONS = [
        { label: "Add Mentor", href: "/mentors/new", icon: UserIcon, bg: "#EFEAFF", color: "#6C4FE0" },
        { label: "Add Mentee", href: "/mentees/new", icon: UsersIcon, bg: "#E6F7EE", color: "#1BA766" },
        { label: "Create Program", href: "/programs/new", icon: BookOpenIcon, bg: "#FFEEE1", color: "#E0793F" },
        { label: "AI Matchmaking", href: "/ai-matchmaking", icon: SparkleIcon, bg: "#E7F0FF", color: "#3167E0" },
        { label: "Manage Settings", href: "/settings", icon: SettingsIcon, bg: "#F1F0FA", color: "#6B6690" },
        { label: "View Reports", href: "/reports", icon: BarChartIcon, bg: "#F3EAFF", color: "#9B4FE0" },
    ]

    return (
        <div className="px-8 py-6">
            <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-[#171139]">
                    Welcome back, {adminName} 👋
                </h1>
                <p className="text-sm text-[#6B6690] mt-1">
                    Here&apos;s what&apos;s happening with your mentorship
                    platform today.
                </p>
            </div>

            {!isAdmin && (
                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5 max-w-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-[#171139]">
                            Recent Chats
                        </h2>
                        <Link
                            href="/chats"
                            className="text-xs font-semibold text-[#6C4FE0] hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3.5">
                        {recentMessages.length === 0 ? (
                            <p className="text-sm text-[#6B6690]">
                                No messages yet.
                            </p>
                        ) : (
                            recentMessages.map((chat) => (
                                <div
                                    key={chat.id}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-9 h-9 rounded-full bg-[#EFEAFF] flex items-center justify-center shrink-0 font-bold text-xs text-[#6C4FE0]">
                                        {chat.counterpartName[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#171139] truncate">
                                            {chat.counterpartName}
                                        </p>
                                        <p className="text-xs text-[#6B6690] truncate">
                                            {chat.preview}
                                        </p>
                                    </div>
                                    <span className="text-[11px] text-[#9C97BE] shrink-0">
                                        {chat.time}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {isAdmin && (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {STAT_CARDS.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl border border-[#EDEBF6] p-5"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                style={{ backgroundColor: stat.bg }}
                            >
                                <Icon
                                    className="w-5 h-5"
                                    style={{ color: stat.color }}
                                />
                            </div>
                            <p className="text-[13px] text-[#6B6690] mb-1">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-extrabold text-[#171139]">
                                {stat.value}
                            </p>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-[#171139]">
                            Recent Activity
                        </h2>
                        <Link
                            href="/audit-logs"
                            className="text-xs font-semibold text-[#6C4FE0] hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    {recentActivity.length === 0 ? (
                        <p className="text-sm text-[#6B6690]">
                            No activity yet.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3.5">
                            {recentActivity.map((item) => (
                                <div key={item.id} className="text-sm">
                                    <p className="text-[#171139]">
                                        <span className="font-semibold">
                                            {item.action}
                                        </span>
                                        {item.detail
                                            ? ` — ${item.detail}`
                                            : ""}
                                    </p>
                                    <p className="text-xs text-[#9C97BE]">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-bold text-[#171139]">
                            AI Match Insights
                        </h2>
                        <span className="text-[10px] font-semibold bg-[#EFEAFF] text-[#6C4FE0] px-2 py-1 rounded-full flex items-center gap-1">
                            <SparkleIcon className="w-3 h-3" />
                            AI Powered
                        </span>
                    </div>

                    <div className="flex justify-center mb-4">
                        <div className="relative w-32 h-32">
                            <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="#EDEBF6" strokeWidth="10" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#6C4FE0"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 42 * (matchRate / 100)} ${2 * Math.PI * 42}`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-extrabold text-[#171139]">
                                    {matchRate}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm font-bold text-[#171139] text-center mb-1">
                        of active mentees are matched
                    </p>
                    <p className="text-xs text-[#6B6690] text-center mb-4">
                        {stats.unmatchedMentees} mentee
                        {stats.unmatchedMentees === 1 ? "" : "s"} still need a
                        mentor.
                    </p>

                    <Link
                        href="/ai-matchmaking"
                        className="flex items-center justify-center gap-1.5 w-full bg-[#EFEAFF] text-[#6C4FE0] text-sm font-semibold py-2.5 rounded-full hover:bg-[#E4DBFF] transition-colors"
                    >
                        <SparkleIcon className="w-4 h-4" />
                        View AI Insights
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-[#171139]">
                            Recent Chats
                        </h2>
                        <Link
                            href="/chats"
                            className="text-xs font-semibold text-[#6C4FE0] hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3.5 flex-1">
                        {recentMessages.length === 0 ? (
                            <p className="text-sm text-[#6B6690]">
                                No messages yet.
                            </p>
                        ) : (
                            recentMessages.map((chat) => (
                                <div
                                    key={chat.id}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-9 h-9 rounded-full bg-[#EFEAFF] flex items-center justify-center shrink-0 font-bold text-xs text-[#6C4FE0]">
                                        {chat.counterpartName[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#171139] truncate">
                                            {chat.counterpartName}
                                        </p>
                                        <p className="text-xs text-[#6B6690] truncate">
                                            {chat.preview}
                                        </p>
                                    </div>
                                    <span className="text-[11px] text-[#9C97BE] shrink-0">
                                        {chat.time}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <Link
                        href="/chats"
                        className="flex items-center justify-center gap-1.5 w-full mt-4 border border-[#EDEBF6] text-[#6C4FE0] text-sm font-semibold py-2.5 rounded-full hover:bg-[#F6F7FB] transition-colors"
                    >
                        Go to All Chats
                        <ArrowUpRightIcon className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.1fr] gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-[#171139]">
                            Recent Mentors
                        </h2>
                        <Link
                            href="/mentors"
                            className="text-xs font-semibold text-[#6C4FE0] hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3 mb-4">
                        {recentMentors.length === 0 ? (
                            <p className="text-sm text-[#6B6690]">
                                No mentors yet.
                            </p>
                        ) : (
                            recentMentors.map((m) => (
                                <Link
                                    key={m.id}
                                    href={m.href}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 rounded-full bg-[#EFEAFF] flex items-center justify-center shrink-0 font-bold text-xs text-[#6C4FE0]">
                                        {m.name[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#171139] truncate">
                                            {m.name}
                                        </p>
                                        <p className="text-xs text-[#6B6690] truncate">
                                            {m.role}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                            m.isActive
                                                ? "bg-[#E6F7EE] text-[#1BA766]"
                                                : "bg-[#F1F0FA] text-[#6B6690]"
                                        }`}
                                    >
                                        {m.isActive ? "Active" : "Inactive"}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>

                    <Link
                        href="/mentors"
                        className="flex items-center justify-center gap-1.5 w-full border border-[#EDEBF6] text-[#171139] text-sm font-semibold py-2.5 rounded-full hover:bg-[#F6F7FB] transition-colors"
                    >
                        <UsersIcon className="w-4 h-4" />
                        Manage Mentors
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-[#171139]">
                            Recent Mentees
                        </h2>
                        <Link
                            href="/mentees"
                            className="text-xs font-semibold text-[#6C4FE0] hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3 mb-4">
                        {recentMentees.length === 0 ? (
                            <p className="text-sm text-[#6B6690]">
                                No mentees yet.
                            </p>
                        ) : (
                            recentMentees.map((m) => (
                                <Link
                                    key={m.id}
                                    href={m.href}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 rounded-full bg-[#E6F7EE] flex items-center justify-center shrink-0 font-bold text-xs text-[#1BA766]">
                                        {m.name[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#171139] truncate">
                                            {m.name}
                                        </p>
                                        <p className="text-xs text-[#6B6690] truncate">
                                            {m.role}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                            m.isActive
                                                ? "bg-[#E6F7EE] text-[#1BA766]"
                                                : "bg-[#F1F0FA] text-[#6B6690]"
                                        }`}
                                    >
                                        {m.isActive ? "Active" : "Inactive"}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>

                    <Link
                        href="/mentees"
                        className="flex items-center justify-center gap-1.5 w-full border border-[#EDEBF6] text-[#171139] text-sm font-semibold py-2.5 rounded-full hover:bg-[#F6F7FB] transition-colors"
                    >
                        <UserIcon className="w-4 h-4" />
                        Manage Mentees
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5">
                    <h2 className="text-base font-bold text-[#171139] mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {QUICK_ACTIONS.map((action) => {
                            const Icon = action.icon
                            return (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-left hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: action.bg }}
                                >
                                    <Icon
                                        className="w-4.5 h-4.5 shrink-0"
                                        style={{ color: action.color }}
                                    />
                                    <span
                                        className="text-xs font-semibold"
                                        style={{ color: action.color }}
                                    >
                                        {action.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {pendingApplications > 0 && (
                <div className="flex items-center gap-4 bg-white rounded-2xl border border-[#EDEBF6] px-5 py-4">
                    <div className="w-9 h-9 rounded-full bg-[#EFEAFF] flex items-center justify-center shrink-0">
                        <SparkleIcon className="w-4 h-4 text-[#6C4FE0]" />
                    </div>
                    <p className="text-sm text-[#171139] flex-1">
                        <span className="font-bold">
                            {pendingApplications} mentor application
                            {pendingApplications === 1 ? "" : "s"}
                        </span>{" "}
                        awaiting your review.
                    </p>
                    <Link
                        href="/users-roles"
                        className="text-sm font-semibold text-[#171139] border border-[#EDEBF6] rounded-full px-4 py-2 hover:bg-[#F6F7FB] transition-colors shrink-0"
                    >
                        Review Now
                    </Link>
                </div>
            )}
            </>
            )}
        </div>
    )
}
