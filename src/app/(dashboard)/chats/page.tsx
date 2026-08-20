"use client"

import { useState } from "react"
import {
    SearchIcon,
    FilterIcon,
    UploadIcon,
    PhoneIcon,
    VideoIcon,
    MoreVerticalIcon,
    PaperclipIcon,
    SmileIcon,
    SendIcon,
    CheckCheckIcon,
    CalendarIcon,
    ArchiveIcon,
    UserIcon,
    SparkleIcon,
} from "@/components/dashboard/icons"

type Role = "Mentor" | "Mentee" | "AI"

interface Message {
    id: string
    fromMe: boolean
    text: string
    time: string
}

interface Conversation {
    id: string
    name: string
    role: Role
    time: string
    preview: string
    unread?: number
    img: string
    online?: boolean
    title?: string
    email?: string
    about?: string
    session?: { title: string; date: string }
    participants: number
    messagesCount: number
    started: string
    lastMessage: string
    messages: Message[]
}

const CONVERSATIONS: Conversation[] = [
    {
        id: "sarah",
        name: "Sarah Johnson",
        role: "Mentor",
        time: "2m ago",
        preview: "Thanks for the resources! I'll review...",
        unread: 2,
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format",
        online: true,
        title: "Product Strategy Lead",
        email: "sarah.johnson@mentorai.com",
        about: "Helping mentees grow in product strategy, leadership and career development.",
        session: { title: "Strategy & Career Growth", date: "May 20, 2025 · 10:00 AM" },
        participants: 2,
        messagesCount: 18,
        started: "May 12, 2025",
        lastMessage: "2m ago",
        messages: [
            { id: "1", fromMe: true, text: "Hi Sarah! Thank you so much for the session today. It was really insightful.", time: "9:30 AM" },
            { id: "2", fromMe: false, text: "You're welcome! I'm glad you found it helpful. How did you like the resources I shared?", time: "9:32 AM" },
            { id: "3", fromMe: true, text: "They were excellent! I especially liked the framework you recommended.", time: "9:33 AM" },
            { id: "4", fromMe: false, text: "Great to hear that! Let me know if you have any questions as you go through them.", time: "9:35 AM" },
            { id: "5", fromMe: true, text: "Will do! I'll also share my progress before our next session.", time: "9:36 AM" },
            { id: "6", fromMe: false, text: "Perfect. Looking forward to it! 👏", time: "9:37 AM" },
        ],
    },
    {
        id: "michael",
        name: "Michael Chen",
        role: "Mentee",
        time: "15m ago",
        preview: "Looking forward to our next session.",
        unread: 1,
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
        title: "Aspiring Product Manager",
        email: "michael.chen@example.com",
        about: "Transitioning into product management from a software engineering background.",
        participants: 2,
        messagesCount: 9,
        started: "May 14, 2025",
        lastMessage: "15m ago",
        messages: [
            { id: "1", fromMe: false, text: "Hi! Just confirming our session for next week.", time: "8:10 AM" },
            { id: "2", fromMe: true, text: "Confirmed, looking forward to it!", time: "8:12 AM" },
            { id: "3", fromMe: false, text: "Looking forward to our next session.", time: "8:14 AM" },
        ],
    },
    {
        id: "emma",
        name: "Emma Williams",
        role: "Mentor",
        time: "1h ago",
        preview: "Here are some additional materials...",
        unread: 3,
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format",
        online: true,
        title: "Leadership Coach",
        email: "emma.williams@mentorai.com",
        about: "Focused on leadership development and executive presence coaching.",
        participants: 2,
        messagesCount: 22,
        started: "Apr 30, 2025",
        lastMessage: "1h ago",
        messages: [
            { id: "1", fromMe: false, text: "Here are some additional materials for our next topic.", time: "7:40 AM" },
            { id: "2", fromMe: true, text: "Thank you, I'll go through them tonight.", time: "7:45 AM" },
        ],
    },
    {
        id: "david",
        name: "David Kim",
        role: "Mentee",
        time: "2h ago",
        preview: "That advice really helped! 🙌",
        unread: 1,
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format",
        title: "Junior Data Analyst",
        email: "david.kim@example.com",
        about: "Building skills in data storytelling and stakeholder communication.",
        participants: 2,
        messagesCount: 14,
        started: "May 2, 2025",
        lastMessage: "2h ago",
        messages: [
            { id: "1", fromMe: false, text: "That advice really helped! 🙌", time: "6:20 AM" },
        ],
    },
    {
        id: "ai",
        name: "AI Assistant",
        role: "AI",
        time: "3h ago",
        preview: "New match recommendation available...",
        img: "",
        title: "Platform Assistant",
        about: "Automated notifications and match recommendations from the MentorAI engine.",
        participants: 1,
        messagesCount: 4,
        started: "May 10, 2025",
        lastMessage: "3h ago",
        messages: [
            { id: "1", fromMe: false, text: "New match recommendation available for review.", time: "5:00 AM" },
        ],
    },
    {
        id: "olivia",
        name: "Olivia Brown",
        role: "Mentee",
        time: "5h ago",
        preview: "Can we reschedule tomorrow's call?",
        unread: 2,
        img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&auto=format",
        title: "Aspiring Data Scientist",
        email: "olivia.brown@example.com",
        about: "Focused on breaking into data science through hands-on projects.",
        participants: 2,
        messagesCount: 11,
        started: "May 6, 2025",
        lastMessage: "5h ago",
        messages: [
            { id: "1", fromMe: false, text: "Can we reschedule tomorrow's call?", time: "4:05 AM" },
        ],
    },
    {
        id: "james",
        name: "James Wilson",
        role: "Mentor",
        time: "1d ago",
        preview: "Great progress on your goals! 💪",
        img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&auto=format",
        title: "Engineering Manager",
        email: "james.wilson@mentorai.com",
        about: "Guides mentees through engineering leadership and technical growth.",
        participants: 2,
        messagesCount: 30,
        started: "Apr 20, 2025",
        lastMessage: "1d ago",
        messages: [
            { id: "1", fromMe: false, text: "Great progress on your goals! 💪", time: "Yesterday" },
        ],
    },
    {
        id: "sophia",
        name: "Sophia Martinez",
        role: "Mentee",
        time: "1d ago",
        preview: "Thank you for the guidance!",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format",
        title: "Marketing Associate",
        email: "sophia.martinez@example.com",
        about: "Growing into a brand strategy role within consumer marketing.",
        participants: 2,
        messagesCount: 8,
        started: "May 8, 2025",
        lastMessage: "1d ago",
        messages: [
            { id: "1", fromMe: false, text: "Thank you for the guidance!", time: "Yesterday" },
        ],
    },
]

const TABS = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", badge: 23 },
    { id: "mentors", label: "Mentors" },
    { id: "mentees", label: "Mentees" },
] as const

function RoleBadge({ role }: { role: Role }) {
    const styles: Record<Role, string> = {
        Mentor: "bg-[#EFEAFF] text-[#6C4FE0]",
        Mentee: "bg-[#E6F7EE] text-[#1BA766]",
        AI: "bg-[#E7F0FF] text-[#3167E0]",
    }
    return (
        <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[role]}`}
        >
            {role}
        </span>
    )
}

export default function ChatsPage() {
    const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("all")
    const [search, setSearch] = useState("")
    const [selectedId, setSelectedId] = useState(CONVERSATIONS[0].id)
    const [draft, setDraft] = useState("")

    const filtered = CONVERSATIONS.filter((c) => {
        if (activeTab === "unread" && !c.unread) return false
        if (activeTab === "mentors" && c.role !== "Mentor") return false
        if (activeTab === "mentees" && c.role !== "Mentee") return false
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
            return false
        return true
    })

    const active = CONVERSATIONS.find((c) => c.id === selectedId) ?? CONVERSATIONS[0]

    return (
        <div className="h-screen flex flex-col">
            <div className="flex items-center justify-between gap-6 flex-wrap px-8 py-6 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#171139]">
                        Chats
                    </h1>
                    <p className="text-sm text-[#6B6690] mt-1">
                        View and manage all conversations across the
                        platform.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <SearchIcon className="w-4 h-4 text-[#9C97BE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="pl-10 pr-4 py-2.5 rounded-full border border-[#E5E3F1] bg-white text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0] w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 border border-[#E5E3F1] bg-white text-sm font-semibold text-[#171139] px-4 py-2.5 rounded-full hover:bg-[#F6F7FB] transition-colors">
                        <FilterIcon className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 bg-[#6C4FE0] text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#5B3FD6] transition-colors shadow-sm shadow-[#6C4FE0]/30">
                        <UploadIcon className="w-4 h-4" />
                        Export Chats
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[340px_1fr_300px] gap-4 px-8 pb-6">
                <div className="bg-white rounded-2xl border border-[#EDEBF6] flex flex-col min-h-0">
                    <div className="flex items-center gap-5 px-4 pt-4 flex-shrink-0 border-b border-[#EDEBF6]">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-1.5 pb-3 text-sm font-semibold transition-colors ${
                                    activeTab === tab.id
                                        ? "text-[#6C4FE0]"
                                        : "text-[#6B6690] hover:text-[#171139]"
                                }`}
                            >
                                {tab.label}
                                {"badge" in tab && tab.badge ? (
                                    <span className="bg-[#6C4FE0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {tab.badge}
                                    </span>
                                ) : null}
                                {activeTab === tab.id && (
                                    <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#6C4FE0] rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-3 flex-shrink-0">
                        <div className="relative">
                            <SearchIcon className="w-4 h-4 text-[#9C97BE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search chats..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EDEBF6] bg-[#F6F7FB] text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0]"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 pb-2">
                        {filtered.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedId(c.id)}
                                className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                                    selectedId === c.id
                                        ? "bg-[#F3EFFF]"
                                        : "hover:bg-[#F6F7FB]"
                                }`}
                            >
                                {c.img ? (
                                    <img
                                        src={c.img}
                                        alt={c.name}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#EFEAFF] flex items-center justify-center flex-shrink-0">
                                        <SparkleIcon className="w-4 h-4 text-[#6C4FE0]" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <p className="text-sm font-semibold text-[#171139] truncate">
                                                {c.name}
                                            </p>
                                            <RoleBadge role={c.role} />
                                        </div>
                                        <span className="text-[11px] text-[#9C97BE] flex-shrink-0">
                                            {c.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs text-[#6B6690] truncate">
                                            {c.preview}
                                        </p>
                                        {c.unread ? (
                                            <span className="bg-[#6C4FE0] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                                                {c.unread}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#EDEBF6] flex flex-col min-h-0">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDEBF6] flex-shrink-0">
                        <div className="flex items-center gap-3">
                            {active.img ? (
                                <img
                                    src={active.img}
                                    alt={active.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-[#EFEAFF] flex items-center justify-center">
                                    <SparkleIcon className="w-4 h-4 text-[#6C4FE0]" />
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-[#171139]">
                                        {active.name}
                                    </p>
                                    <RoleBadge role={active.role} />
                                </div>
                                {active.online && (
                                    <p className="text-xs text-[#1BA766] flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#1BA766]" />
                                        Online
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="w-9 h-9 rounded-full border border-[#EDEBF6] flex items-center justify-center text-[#6B6690] hover:bg-[#F6F7FB] transition-colors">
                                <PhoneIcon className="w-4 h-4" />
                            </button>
                            <button className="w-9 h-9 rounded-full border border-[#EDEBF6] flex items-center justify-center text-[#6B6690] hover:bg-[#F6F7FB] transition-colors">
                                <VideoIcon className="w-4 h-4" />
                            </button>
                            <button className="w-9 h-9 rounded-full border border-[#EDEBF6] flex items-center justify-center text-[#6B6690] hover:bg-[#F6F7FB] transition-colors">
                                <MoreVerticalIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        <p className="text-center text-xs text-[#9C97BE] mb-5">
                            Today
                        </p>
                        <div className="flex flex-col gap-4">
                            {active.messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex flex-col ${m.fromMe ? "items-end" : "items-start"}`}
                                >
                                    <span className="text-[11px] text-[#9C97BE] mb-1">
                                        {m.time}
                                    </span>
                                    <div
                                        className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                                            m.fromMe
                                                ? "bg-[#6C4FE0] text-white rounded-br-sm"
                                                : "bg-[#F6F7FB] text-[#171139] rounded-bl-sm"
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                    {m.fromMe && (
                                        <CheckCheckIcon className="w-4 h-4 text-[#6C4FE0] mt-1" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-5 py-4 border-t border-[#EDEBF6] flex-shrink-0">
                        <button className="text-[#9C97BE] hover:text-[#6B6690] flex-shrink-0">
                            <PaperclipIcon className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none"
                        />
                        <button className="text-[#9C97BE] hover:text-[#6B6690] flex-shrink-0">
                            <SmileIcon className="w-5 h-5" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-[#6C4FE0] flex items-center justify-center text-white hover:bg-[#5B3FD6] transition-colors flex-shrink-0">
                            <SendIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5 overflow-y-auto min-h-0">
                    <h2 className="text-sm font-bold text-[#171139] mb-4">
                        Conversation Details
                    </h2>

                    <div className="flex items-center gap-3 mb-4">
                        {active.img ? (
                            <img
                                src={active.img}
                                alt={active.name}
                                className="w-11 h-11 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-[#EFEAFF] flex items-center justify-center">
                                <SparkleIcon className="w-5 h-5 text-[#6C4FE0]" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold text-[#171139] truncate">
                                    {active.name}
                                </p>
                                <RoleBadge role={active.role} />
                            </div>
                            {active.email && (
                                <p className="text-xs text-[#6B6690] truncate">
                                    {active.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {active.title && (
                        <p className="text-xs text-[#6B6690] mb-1">
                            {active.title}
                        </p>
                    )}
                    {active.online && (
                        <p className="text-xs text-[#1BA766] flex items-center gap-1 mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1BA766]" />
                            Online
                        </p>
                    )}

                    {active.about && (
                        <div className="mb-5">
                            <h3 className="text-xs font-bold text-[#171139] mb-1.5">
                                About
                            </h3>
                            <p className="text-xs text-[#6B6690] leading-relaxed">
                                {active.about}
                            </p>
                        </div>
                    )}

                    {active.session && (
                        <div className="mb-5">
                            <h3 className="text-xs font-bold text-[#171139] mb-2">
                                Linked Session
                            </h3>
                            <div className="bg-[#F6F7FB] rounded-xl p-3">
                                <div className="flex items-start gap-2.5 mb-2">
                                    <CalendarIcon className="w-4 h-4 text-[#6C4FE0] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-[#171139]">
                                            {active.session.title}
                                        </p>
                                        <p className="text-[11px] text-[#9C97BE]">
                                            {active.session.date}
                                        </p>
                                    </div>
                                </div>
                                <button className="w-full text-center text-xs font-semibold text-[#6C4FE0] bg-white border border-[#EDEBF6] rounded-lg py-2 hover:bg-[#F6F7FB] transition-colors">
                                    View Session
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mb-5">
                        <h3 className="text-xs font-bold text-[#171139] mb-2">
                            Conversation Info
                        </h3>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: "Participants", value: active.participants },
                                { label: "Messages", value: active.messagesCount },
                                { label: "Started", value: active.started },
                                { label: "Last Message", value: active.lastMessage },
                            ].map((row) => (
                                <div
                                    key={row.label}
                                    className="flex items-center justify-between text-xs"
                                >
                                    <span className="text-[#6B6690]">
                                        {row.label}
                                    </span>
                                    <span className="font-semibold text-[#171139]">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-[#171139] mb-2">
                            Actions
                        </h3>
                        <div className="flex flex-col gap-1">
                            <button className="flex items-center gap-2.5 text-xs font-medium text-[#171139] hover:bg-[#F6F7FB] rounded-lg px-2 py-2 transition-colors">
                                <SearchIcon className="w-4 h-4 text-[#6B6690]" />
                                Search in Conversation
                            </button>
                            <button className="flex items-center gap-2.5 text-xs font-medium text-[#171139] hover:bg-[#F6F7FB] rounded-lg px-2 py-2 transition-colors">
                                <UserIcon className="w-4 h-4 text-[#6B6690]" />
                                View Participant Profile
                            </button>
                            <button className="flex items-center gap-2.5 text-xs font-medium text-[#E0524A] hover:bg-[#FDEDEC] rounded-lg px-2 py-2 transition-colors">
                                <ArchiveIcon className="w-4 h-4" />
                                Archive Conversation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
