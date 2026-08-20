"use client"

import Link from "next/link"
import { useState } from "react"
import {
    UsersIcon,
    UserIcon,
    SparkleIcon,
    CalendarIcon,
    BellIcon,
    SearchIcon,
    PlusIcon,
    ChevronDownIcon,
    ArrowUpRightIcon,
    BookOpenIcon,
    BarChartIcon,
    SettingsIcon,
    XIcon,
} from "@/components/dashboard/icons"

const STATS = [
    {
        label: "Total Mentors",
        value: "128",
        change: "12%",
        icon: UserIcon,
        bg: "#EFEAFF",
        color: "#6C4FE0",
    },
    {
        label: "Total Mentees",
        value: "342",
        change: "18%",
        icon: UsersIcon,
        bg: "#E6F7EE",
        color: "#1BA766",
    },
    {
        label: "Active Matches",
        value: "246",
        change: "15%",
        icon: UsersIcon,
        bg: "#FFEEE1",
        color: "#E0793F",
    },
    {
        label: "Sessions Completed",
        value: "523",
        change: "20%",
        icon: CalendarIcon,
        bg: "#E7F0FF",
        color: "#3167E0",
    },
    {
        label: "AI Recommendations",
        value: "89",
        change: "25%",
        icon: SparkleIcon,
        bg: "#F3EAFF",
        color: "#9B4FE0",
    },
]

const RECENT_CHATS = [
    {
        name: "Sarah Johnson",
        role: "Mentor",
        time: "2m ago",
        message: "Thanks for the great session today!...",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&auto=format",
    },
    {
        name: "Michael Chen",
        role: "Mentee",
        time: "15m ago",
        message: "Looking forward to our next meeting.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    },
    {
        name: "Emma Williams",
        role: "Mentor",
        time: "1h ago",
        message: "Here are some resources I recommended...",
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format",
    },
    {
        name: "David Kim",
        role: "Mentee",
        time: "2h ago",
        message: "That advice really helped!",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
    },
    {
        name: "AI Assistant",
        role: "AI",
        time: "3h ago",
        message: "New match recommendation available for review.",
        img: "",
    },
]

const RECENT_MENTORS = [
    { name: "Dr. Jessica Morgan", role: "Leadership Coach", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&auto=format" },
    { name: "Alex Thompson", role: "Product Manager at TechCorp", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format" },
    { name: "Priya Sharma", role: "Career Strategist", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format" },
    { name: "Daniel Okafor", role: "Software Engineer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format" },
]

const RECENT_MENTEES = [
    { name: "Olivia Brown", role: "Aspiring Data Scientist", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&auto=format" },
    { name: "Liam Wilson", role: "Marketing Professional", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format" },
    { name: "Ava Rodriguez", role: "UX Designer", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&auto=format" },
    { name: "Noah Johnson", role: "Business Student", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format" },
]

const QUICK_ACTIONS = [
    { label: "Add Mentor", icon: UserIcon, bg: "#EFEAFF", color: "#6C4FE0" },
    { label: "Add Mentee", icon: UsersIcon, bg: "#E6F7EE", color: "#1BA766" },
    { label: "Create Program", icon: BookOpenIcon, bg: "#FFEEE1", color: "#E0793F" },
    { label: "AI Matchmaking", icon: SparkleIcon, bg: "#E7F0FF", color: "#3167E0" },
    { label: "Manage Settings", icon: SettingsIcon, bg: "#F1F0FA", color: "#6B6690" },
    { label: "View Reports", icon: BarChartIcon, bg: "#F3EAFF", color: "#9B4FE0" },
]

function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, string> = {
        Mentor: "bg-[#EFEAFF] text-[#6C4FE0]",
        Mentee: "bg-[#E6F7EE] text-[#1BA766]",
        AI: "bg-[#E7F0FF] text-[#3167E0]",
    }
    return (
        <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[role] ?? "bg-gray-100 text-gray-600"}`}
        >
            {role}
        </span>
    )
}

export default function DashboardPage() {
    const [showAiBanner, setShowAiBanner] = useState(true)

    return (
        <div className="px-8 py-6">
            <div className="flex items-start justify-between gap-6 flex-wrap mb-7">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#171139]">
                        Welcome back, Admin 👋
                    </h1>
                    <p className="text-sm text-[#6B6690] mt-1">
                        Here&apos;s what&apos;s happening with your mentorship
                        platform today.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <SearchIcon className="w-4 h-4 text-[#9C97BE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="pl-10 pr-4 py-2.5 rounded-full border border-[#E5E3F1] bg-white text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0] w-56"
                        />
                    </div>

                    <button className="flex items-center gap-2 bg-[#6C4FE0] text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#5B3FD6] transition-colors shadow-sm shadow-[#6C4FE0]/30">
                        <PlusIcon className="w-4 h-4" />
                        Add New
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>

                    <button className="relative w-10 h-10 rounded-full border border-[#E5E3F1] bg-white flex items-center justify-center hover:bg-[#F6F7FB] transition-colors">
                        <BellIcon className="w-4.5 h-4.5 text-[#171139]" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E0793F] text-white text-[10px] font-bold flex items-center justify-center">
                            3
                        </span>
                    </button>

                    <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&auto=format"
                        alt="Admin User"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {STATS.map((stat) => {
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
                            <p className="text-2xl font-extrabold text-[#171139] mb-1.5">
                                {stat.value}
                            </p>
                            <p className="text-xs font-semibold text-[#1BA766] flex items-center gap-1">
                                <ArrowUpRightIcon className="w-3 h-3" />
                                {stat.change} this month
                            </p>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-bold text-[#171139]">
                            Platform Overview
                        </h2>
                        <button className="flex items-center gap-1.5 text-xs font-medium text-[#6B6690] border border-[#EDEBF6] rounded-full px-3 py-1.5">
                            Last 30 days
                            <ChevronDownIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <svg viewBox="0 0 400 160" className="w-full h-40">
                        <polyline
                            fill="none"
                            stroke="#6C4FE0"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="0,90 60,70 120,80 180,55 240,65 300,40 360,45 400,30"
                        />
                        <polyline
                            fill="none"
                            stroke="#1BA766"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="0,120 60,110 120,115 180,95 240,100 300,85 360,90 400,75"
                        />
                        <polyline
                            fill="none"
                            stroke="#E0793F"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="0,145 60,140 120,142 180,130 240,135 300,120 360,125 400,115"
                        />
                    </svg>

                    <div className="flex items-center gap-5 mt-2">
                        {[
                            { label: "Mentors", color: "#6C4FE0" },
                            { label: "Mentees", color: "#1BA766" },
                            { label: "Matches", color: "#E0793F" },
                        ].map((l) => (
                            <div
                                key={l.label}
                                className="flex items-center gap-1.5 text-xs text-[#6B6690]"
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: l.color }}
                                />
                                {l.label}
                            </div>
                        ))}
                    </div>
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
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#EDEBF6"
                                    strokeWidth="10"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke="#6C4FE0"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 42 * 0.86} ${2 * Math.PI * 42}`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-extrabold text-[#171139]">
                                    86%
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm font-bold text-[#171139] text-center mb-1">
                        Great matches this month!
                    </p>
                    <p className="text-xs text-[#6B6690] text-center mb-4">
                        AI has identified strong compatibility between
                        mentors and mentees.
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
                        {RECENT_CHATS.map((chat) => (
                            <div
                                key={chat.name}
                                className="flex items-start gap-3"
                            >
                                {chat.img ? (
                                    <img
                                        src={chat.img}
                                        alt={chat.name}
                                        className="w-9 h-9 rounded-full object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-[#EFEAFF] flex items-center justify-center shrink-0">
                                        <SparkleIcon className="w-4 h-4 text-[#6C4FE0]" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <p className="text-sm font-semibold text-[#171139] truncate">
                                            {chat.name}
                                        </p>
                                        <RoleBadge role={chat.role} />
                                    </div>
                                    <p className="text-xs text-[#6B6690] truncate">
                                        {chat.message}
                                    </p>
                                </div>
                                <span className="text-[11px] text-[#9C97BE] shrink-0">
                                    {chat.time}
                                </span>
                            </div>
                        ))}
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
                        {RECENT_MENTORS.map((m) => (
                            <div
                                key={m.name}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src={m.img}
                                    alt={m.name}
                                    className="w-9 h-9 rounded-full object-cover shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-[#171139] truncate">
                                        {m.name}
                                    </p>
                                    <p className="text-xs text-[#6B6690] truncate">
                                        {m.role}
                                    </p>
                                </div>
                                <span className="text-[10px] font-semibold bg-[#E6F7EE] text-[#1BA766] px-2 py-0.5 rounded-full shrink-0">
                                    Active
                                </span>
                            </div>
                        ))}
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
                        {RECENT_MENTEES.map((m) => (
                            <div
                                key={m.name}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src={m.img}
                                    alt={m.name}
                                    className="w-9 h-9 rounded-full object-cover shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-[#171139] truncate">
                                        {m.name}
                                    </p>
                                    <p className="text-xs text-[#6B6690] truncate">
                                        {m.role}
                                    </p>
                                </div>
                                <span className="text-[10px] font-semibold bg-[#E6F7EE] text-[#1BA766] px-2 py-0.5 rounded-full shrink-0">
                                    Active
                                </span>
                            </div>
                        ))}
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
                                <button
                                    key={action.label}
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
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {showAiBanner && (
                <div className="flex items-center gap-4 bg-white rounded-2xl border border-[#EDEBF6] px-5 py-4">
                    <div className="w-9 h-9 rounded-full bg-[#EFEAFF] flex items-center justify-center shrink-0">
                        <SparkleIcon className="w-4 h-4 text-[#6C4FE0]" />
                    </div>
                    <p className="text-sm text-[#171139] flex-1">
                        <span className="font-bold">AI Assistant:</span> Your
                        platform engagement is up 23% this week. Consider
                        reviewing 5 pending match recommendations.
                    </p>
                    <button className="text-sm font-semibold text-[#171139] border border-[#EDEBF6] rounded-full px-4 py-2 hover:bg-[#F6F7FB] transition-colors shrink-0">
                        Review Now
                    </button>
                    <button
                        onClick={() => setShowAiBanner(false)}
                        className="text-[#9C97BE] hover:text-[#171139] shrink-0"
                        aria-label="Dismiss"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
