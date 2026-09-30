import type { Metadata } from "next"
import Link from "next/link"
import {
    ArrowRight,
    Bot,
    Briefcase,
    CalendarClock,
    ChartColumn,
    ChartColumnIncreasing,
    CircleCheck,
    CirclePlay,
    FileSearch,
    Globe,
    GraduationCap,
    HeartPulse,
    Laptop,
    Leaf,
    Library,
    MessagesSquare,
    Palette,
    Users,
    Video,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
    title: "How It Works · Global Youth Emerge",
    description:
        "Chat with our AI assistant, get matched with the right mentor, and choose how you'd like to connect.",
}

const WP = "https://globalyouthemerge.org/wp-content/uploads"

const STEPS = [
    {
        title: "Chat with Our AI Assistant",
        desc: "Share your goals, interests and questions. Our AI assistant understands your needs and guides you to the right mentorship support.",
        icon: MessagesSquare,
        tone: "blue",
    },
    {
        title: "Get Matched with a Mentor",
        desc: "Based on your interests and goals, we connect you with a suitable mentor from our network of experts across 10 life-changing fields.",
        icon: FileSearch,
        tone: "orange",
    },
    {
        title: "Choose How to Connect",
        desc: "You can chat with your mentor, book a video call session, or arrange a face-to-face meeting (where available).",
        icon: CalendarClock,
        tone: "blue",
    },
    {
        title: "Learn, Grow, and Keep Going",
        desc: "Gain practical advice, build your skills, and continue the conversation as you progress on your journey.",
        icon: ChartColumnIncreasing,
        tone: "orange",
    },
] as const

const CONNECT_OPTIONS = [
    {
        title: "Chat Online",
        desc: "Ask questions, get advice and continue the conversation anytime through our secure messaging platform.",
        img: `${WP}/2025/04/Youth.jpg`,
        icon: MessagesSquare,
        badge: "bg-[#1B6FD8]",
        points: [
            "Quick and convenient",
            "Share resources and links",
            "Get ongoing support",
        ],
    },
    {
        title: "Video Call Sessions",
        desc: "Book one-on-one video calls with your mentor at a time that works for both of you.",
        img: `${WP}/2025/04/about-1.jpg`,
        icon: Video,
        badge: "bg-[#E07830]",
        points: [
            "Deeper, personal conversations",
            "Discuss specific goals or projects",
            "Flexible scheduling",
        ],
    },
    {
        title: "Face-to-Face Mentorship",
        desc: "Where available, you can meet your mentor in person for richer learning and networking opportunities.",
        img: `${WP}/2025/04/Blog2.jpg`,
        icon: Users,
        badge: "bg-[#0D2B5E]",
        points: [
            "Build stronger relationships",
            "Gain real-world insights",
            "Attend events and meetups",
        ],
    },
]

const FIELDS = [
    { label: "Career Development", icon: Briefcase, color: "#E07830" },
    { label: "Education & Learning", icon: GraduationCap, color: "#0D2B5E" },
    { label: "Business & Entrepreneurship", icon: ChartColumn, color: "#2E7D32" },
    { label: "Technology & Digital Skills", icon: Laptop, color: "#7B3FA0" },
    { label: "Health & Wellbeing", icon: HeartPulse, color: "#1B6FD8" },
    { label: "Environment & Sustainability", icon: Leaf, color: "#2E7D32" },
    { label: "Leadership & Civic Engagement", icon: Users, color: "#E0485A" },
    { label: "Arts & Creative Industries", icon: Palette, color: "#F2A516" },
    { label: "Global Citizenship & Social Impact", icon: Globe, color: "#D32F2F" },
    { label: "Personal Development", icon: Library, color: "#7B3FA0" },
]

// Real GYE stories (same people as the homepage "Success Stories").
const TESTIMONIALS = [
    {
        name: "Thiery, 23",
        location: "Burundi",
        img: "/images/home-1.jpg",
        text: "Through GYE mentorship and support for driving lessons, Thiery got his licence and now owns and operates his own taxi to support his family.",
    },
    {
        name: "David, 19",
        location: "Kenya",
        img: "/images/Youth3.jpg",
        text: "From repairing phones on a wooden crate to running “David's Corner” — skills training and mentorship helped him grow a business and train two other young men.",
    },
    {
        name: "Mary, 28",
        location: "Kenya",
        img: "/images/home-3.jpeg",
        text: "Business training and continued mentorship helped Mary grow her fish stall into two businesses. She now employs two people and all three children are back in school.",
    },
]

export default function HowItWorksPage() {
    return (
        <div className="bg-white text-[#0D1F3C]">
            <Navbar />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="relative pt-16 bg-[#0D2B5E] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1B4B8A] opacity-60" />
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#1B4B8A] opacity-40" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">
                            How It Works
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                            From a question
                            <br />
                            to real guidance
                            <br />
                            <span className="text-[#F28A3C]">
                                in a few simple steps
                            </span>
                        </h1>
                        <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-10 max-w-md">
                            Start with a quick chat with our AI assistant, get
                            matched with the right mentor, and choose how
                            you&apos;d like to connect — chat, video call, or
                            face-to-face.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/mentors"
                                className="bg-[#E07830] text-white font-bold px-7 py-3.5 rounded-full hover:bg-[#C96820] transition-all hover:scale-105 active:scale-100 shadow-lg flex items-center justify-center gap-2"
                            >
                                Find My Mentor
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="#process"
                                className="border border-white/40 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <CirclePlay className="w-5 h-5" />
                                Watch How It Works
                            </a>
                        </div>
                    </div>

                    {/* Hero visual: youth photo + AI chat bubble + matched mentor */}
                    <div className="relative h-80 sm:h-96 lg:h-[26rem]">
                        <div className="absolute left-0 bottom-0 w-[68%] h-[92%] rounded-[2rem] overflow-hidden ring-4 ring-white/10 shadow-2xl">
                            <img
                                src={`${WP}/2025/04/home-3.jpg`}
                                alt="Young people smiling together at a Global Youth Emerge event"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="absolute left-[40%] top-0 bg-white text-[#0D1F3C] text-sm font-medium px-4 py-3 rounded-2xl rounded-bl-sm shadow-xl max-w-[11rem]">
                            Hi! How can I help you today?
                        </div>
                        <div className="absolute left-[52%] top-[58%] sm:top-[36%] w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-xl flex items-center justify-center ring-4 ring-[#1B6FD8]/40">
                            <Bot className="w-9 h-9 sm:w-11 sm:h-11 text-[#1B6FD8]" />
                        </div>

                        <svg
                            viewBox="0 0 120 60"
                            fill="none"
                            className="hidden sm:block absolute left-[62%] top-[14%] w-24 text-white/70"
                        >
                            <path
                                d="M4 30 C 30 0, 70 0, 110 40"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="5 5"
                            />
                            <path
                                d="M102 40 L111 41 L109 32"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="absolute right-0 top-[18%] w-28 sm:w-40">
                            <div className="rounded-2xl overflow-hidden bg-white p-1.5 shadow-2xl rotate-3">
                                <img
                                    src={`${WP}/2025/04/1.jpg`}
                                    alt="A Global Youth Emerge mentor"
                                    className="w-full aspect-[4/5] object-cover object-[35%_20%] rounded-xl"
                                />
                            </div>
                            <div className="-mt-4 relative mx-auto w-fit bg-[#E07830] text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg -rotate-3">
                                Matched Mentor
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── THE PROCESS ──────────────────────────────────────────── */}
            <section
                id="process"
                className="py-16 md:py-20 max-w-7xl mx-auto px-6 scroll-mt-16"
            >
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D2B5E]">
                        The Process
                    </h2>
                    <p className="text-[#4A6080] mt-2">
                        A simple journey from your first question to meaningful
                        mentorship.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-6 lg:gap-3 items-stretch">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon
                        const orange = step.tone === "orange"
                        return (
                            <div key={step.title} className="contents">
                                <div
                                    className={`rounded-2xl p-6 ${orange ? "bg-[#FEF4EC]" : "bg-[#EEF3FA]"}`}
                                >
                                    <div
                                        className={`w-9 h-9 rounded-full text-white font-extrabold flex items-center justify-center ${orange ? "bg-[#E07830]" : "bg-[#0D2B5E]"}`}
                                    >
                                        {i + 1}
                                    </div>
                                    <Icon
                                        strokeWidth={1.75}
                                        className={`w-14 h-14 mx-auto my-4 ${orange ? "text-[#0D2B5E]" : "text-[#1B6FD8]"}`}
                                    />
                                    <h3 className="font-extrabold text-lg text-[#0D2B5E] leading-snug mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-[#4A6080]">
                                        {step.desc}
                                    </p>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className="hidden lg:flex items-center text-[#0D2B5E]">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ── WAYS TO CONNECT ──────────────────────────────────────── */}
            <section className="bg-[#F1F6FC] py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D2B5E]">
                            Ways to Connect with Your Mentor
                        </h2>
                        <p className="text-[#4A6080] mt-2">
                            Flexible options to fit your goals and schedule.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {CONNECT_OPTIONS.map((option) => {
                            const Icon = option.icon
                            return (
                                <div
                                    key={option.title}
                                    className="bg-white rounded-2xl p-3 shadow-sm flex flex-col"
                                >
                                    <div className="relative">
                                        <img
                                            src={option.img}
                                            alt={option.title}
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        <div
                                            className={`absolute right-3 -bottom-5 w-14 h-14 rounded-full ${option.badge} ring-4 ring-white text-white flex items-center justify-center shadow-lg`}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="px-3 pt-5 pb-4">
                                        <h3 className="font-extrabold text-lg text-[#0D2B5E] mb-2">
                                            {option.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[#4A6080]">
                                            {option.desc}
                                        </p>
                                    </div>
                                    <ul className="mt-auto bg-[#F1F6FC] rounded-xl px-5 py-4 space-y-2.5">
                                        {option.points.map((point) => (
                                            <li
                                                key={point}
                                                className="flex items-center gap-2.5 text-sm text-[#0D1F3C]"
                                            >
                                                <CircleCheck className="w-4 h-4 shrink-0 fill-[#1B6FD8] text-white" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── FIELDS ───────────────────────────────────────────────── */}
            <section className="bg-[#F1F6FC] pb-16 md:pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D2B5E]">
                            Supported Across 10 Life-Changing Fields
                        </h2>
                        <p className="text-[#4A6080] mt-2">
                            Get guidance from experienced mentors in areas such
                            as:
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {FIELDS.map((field) => {
                            const Icon = field.icon
                            return (
                                <div
                                    key={field.label}
                                    className="bg-white rounded-xl px-4 py-5 text-center shadow-sm flex flex-col items-center gap-3"
                                >
                                    <Icon
                                        className="w-9 h-9"
                                        style={{ color: field.color }}
                                    />
                                    <span className="text-sm font-bold text-[#0D2B5E] leading-snug">
                                        {field.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
            <section className="py-16 md:py-20 max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D2B5E] text-center mb-10">
                    What Young People Are Saying
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t) => (
                        <div
                            key={t.name}
                            className="rounded-2xl border border-[#E2EAF4] shadow-sm p-5 flex gap-4"
                        >
                            <div className="shrink-0 w-20 text-center">
                                <img
                                    src={t.img}
                                    alt={t.name}
                                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2 bg-[#EEF3FA]"
                                />
                                <div className="text-sm font-bold text-[#0D2B5E]">
                                    {t.name}
                                </div>
                                <div className="text-xs text-[#4A6080]">
                                    {t.location}
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-[#4A6080]">
                                {t.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <section className="px-4 pb-16">
                <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-[#0D2B5E] grid lg:grid-cols-2">
                    <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                            Ready to start your
                            <br />
                            <span className="text-[#F28A3C]">
                                mentorship journey?
                            </span>
                        </h2>
                        <p className="text-blue-100 mb-8 max-w-md">
                            Chat with our AI assistant now and get connected
                            with a mentor who can help you grow.
                        </p>
                        <Link
                            href="/mentors"
                            className="w-fit bg-[#E07830] text-white font-bold px-7 py-3.5 rounded-full hover:bg-[#C96820] transition-all hover:scale-105 active:scale-100 shadow-lg flex items-center gap-2"
                        >
                            Find My Mentor
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="relative h-64 lg:h-auto">
                        <img
                            src={`${WP}/2026/02/mukuru-project.jpg`}
                            alt="Young people at a Global Youth Emerge project in Mukuru"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0D2B5E] to-transparent" />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
