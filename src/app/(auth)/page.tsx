"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

const CATEGORIES = [
    {
        id: 1,
        title: "Career Mentors",
        tagline: "Find your professional path",
        desc: "Navigate interviews, craft a winning resume, and connect with industry leaders who have walked your road.",
        color: "#1B4B8A",
        bg: "#EEF3FA",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <rect
                    x="4"
                    y="10"
                    width="24"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M11 10V8a5 5 0 0110 0v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path d="M4 18h24" stroke="currentColor" strokeWidth="2" />
                <circle cx="16" cy="18" r="2" fill="currentColor" />
            </svg>
        ),
        count: 142,
    },
    {
        id: 2,
        title: "Entrepreneurship",
        tagline: "Build what you believe in",
        desc: "From idea to launch — guidance from founders who have raised capital and scaled real businesses.",
        color: "#E07830",
        bg: "#FEF4EC",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <path
                    d="M16 4L4 12v16h24V12L16 4z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 28V20h8v8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        count: 98,
    },
    {
        id: 3,
        title: "Education & Scholarships",
        tagline: "Open every academic door",
        desc: "Scholarship applications, university selection, and study strategies — mentors who secured top opportunities share the playbook.",
        color: "#2E7D32",
        bg: "#EDF7EE",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <path
                    d="M16 4L2 12l14 8 14-8L16 4z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M6 15v8c0 2.761 4.477 5 10 5s10-2.239 10-5v-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        ),
        count: 167,
    },
    {
        id: 4,
        title: "Financial Literacy",
        tagline: "Master your money early",
        desc: "Budgeting, investing, saving, and understanding credit — the financial skills school never taught you.",
        color: "#1565C0",
        bg: "#E8F0FB",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M16 8v2M16 22v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M12 12.5C12 11.12 13.79 10 16 10s4 1.12 4 2.5c0 1.5-1.5 2-4 2.5s-4 1-4 2.5C12 19 13.79 20 16 20s4-1 4-2.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        ),
        count: 83,
    },
    {
        id: 5,
        title: "Mental Health & Well-being",
        tagline: "Your mind matters most",
        desc: "Talk to mentors and coaches trained in youth wellness, stress management, and building resilient mindsets.",
        color: "#7B3FA0",
        bg: "#F5EDF9",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <path
                    d="M16 27S4 21 4 13a7 7 0 0113.5-2.6A7 7 0 0128 13c0 8-12 14-12 14z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        count: 74,
    },
    {
        id: 6,
        title: "Technology Mentors",
        tagline: "Code the future you want",
        desc: "Software engineering, AI, data science, and product design — mentors from top tech companies worldwide.",
        color: "#00838F",
        bg: "#E0F5F7",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <rect
                    x="3"
                    y="6"
                    width="26"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M12 14l-4 4 4 4M20 14l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        count: 211,
    },
    {
        id: 7,
        title: "Leadership Mentors",
        tagline: "Lead with purpose and vision",
        desc: "Develop your voice, build influence, and inspire teams — from community to corporate leadership.",
        color: "#B71C1C",
        bg: "#FDECEA",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <circle
                    cx="16"
                    cy="10"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M8 28v-2a8 8 0 0116 0v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M22 14a6 6 0 010 10M10 14a6 6 0 000 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        ),
        count: 61,
    },
    {
        id: 8,
        title: "Women Empowerment",
        tagline: "Rise, lead, and inspire",
        desc: "Dedicated space for young women — navigating barriers, building confidence, and accessing networks that open doors.",
        color: "#C2185B",
        bg: "#FCE4EC",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <circle
                    cx="16"
                    cy="13"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M16 20v8M12 25h8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        ),
        count: 129,
    },
    {
        id: 9,
        title: "Life Coaches",
        tagline: "Design your life intentionally",
        desc: "Clarity on goals, habits that stick, and accountability partnerships — coaches who help you become who you are meant to be.",
        color: "#E07830",
        bg: "#FEF4EC",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <path
                    d="M16 4l2.47 7.6H26l-6.18 4.49 2.36 7.26L16 18.87l-6.18 4.48 2.36-7.26L6 11.6h7.53L16 4z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        count: 95,
    },
    {
        id: 10,
        title: "Agriculture & Green Economy",
        tagline: "Grow the planet's next chapter",
        desc: "Sustainable farming, agribusiness, climate innovation — mentors shaping the green economy of tomorrow.",
        color: "#1B5E20",
        bg: "#E8F5E9",
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <path
                    d="M16 28V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M16 16C16 16 8 14 6 6c6-2 14 2 14 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 16c0 0 8-4 10-12-6-2-14 2-14 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M8 28h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        ),
        count: 57,
    },
]

const STEPS = [
    {
        num: "01",
        title: "Create Your Profile",
        desc: "Tell us about your goals, interests, and what kind of guidance you are looking for. Takes less than 3 minutes.",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle
                    cx="20"
                    cy="14"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M8 36v-2a12 12 0 0124 0v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M30 10l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        num: "02",
        title: "Get AI-Matched",
        desc: "Our platform pairs you with mentors whose experience, background, and communication style align with your aspirations.",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle
                    cx="14"
                    cy="20"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle
                    cx="26"
                    cy="20"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M20 12v16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                />
            </svg>
        ),
    },
    {
        num: "03",
        title: "Start Growing",
        desc: "Book sessions, join group mentorships, access resources, and track your progress with a dedicated mentor by your side.",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path
                    d="M8 28l8-8 6 6 10-14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle
                    cx="32"
                    cy="12"
                    r="3"
                    fill="currentColor"
                    fillOpacity="0.3"
                    stroke="currentColor"
                    strokeWidth="2"
                />
            </svg>
        ),
    },
]

const MENTORS = [
    {
        name: "Amara Diallo",
        role: "Software Engineer, Google",
        category: "Technology",
        color: "#00838F",
        sessions: 312,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&auto=format",
        quote: "I remember not knowing how to start. Now I help others skip the confusion and build faster.",
    },
    {
        name: "Kwame Asante",
        role: "Founder & CEO, AgriTech Ventures",
        category: "Entrepreneurship",
        color: "#E07830",
        sessions: 198,
        rating: 4.8,
        img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&auto=format",
        quote: "Every great business started as a conversation. Let's have yours.",
    },
    {
        name: "Zara Okonkwo",
        role: "Rhodes Scholar, Oxford University",
        category: "Education",
        color: "#2E7D32",
        sessions: 274,
        rating: 5.0,
        img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&auto=format",
        quote: "Scholarship doors aren't locked — they just need the right key. I help you find it.",
    },
    {
        name: "Naledi Sithole",
        role: "Licensed Clinical Psychologist",
        category: "Mental Health",
        color: "#7B3FA0",
        sessions: 421,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
        quote: "Strength is asking for support. I'm here when you need it.",
    },
]

const TESTIMONIALS = [
    {
        name: "Temi A.",
        location: "Lagos, Nigeria",
        age: 19,
        text: "Before GYE Mentorship, I had zero idea how to apply for scholarships abroad. Six months later I have a full ride to study Computer Science in the Netherlands.",
        category: "Education & Scholarships",
        img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&auto=format",
    },
    {
        name: "Sipho M.",
        location: "Johannesburg, South Africa",
        age: 22,
        text: "My mentor helped me pitch to investors, refine my business model, and close our first round of funding. It was genuinely transformational.",
        category: "Entrepreneurship",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format",
    },
    {
        name: "Aisha K.",
        location: "Nairobi, Kenya",
        age: 20,
        text: "I was struggling silently with anxiety. Finding a safe space with a qualified mentor changed everything for me. I finally feel in control of my life.",
        category: "Mental Health & Well-being",
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format",
    },
]

const STATS = [
    { value: "12,400+", label: "Youth Mentored" },
    { value: "1,117", label: "Expert Mentors" },
    { value: "10", label: "Focus Areas" },
    { value: "44", label: "Countries" },
]

export default function App() {
    const [activeCategory, setActiveCategory] = useState<number | null>(null)
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="bg-white text-[#0D1F3C]"
        >
            {/* ── NAV ─────────────────────────────────────────────────── */}
            <Navbar />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section
                id="home"
                className="relative pt-16 min-h-screen bg-[#0D2B5E] overflow-hidden flex flex-col"
            >
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-175 h-175 rounded-full bg-[#1B4B8A] opacity-50 translate-x-1/3 -translate-y-1/4" />
                    <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-[#1B4B8A] opacity-30 -translate-x-1/2 translate-y-1/3" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-225 rounded-full border border-white/5" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full border border-white/5" />
                </div>

                {/* Main hero content */}
                <div className="relative max-w-7xl mx-auto px-6 flex-1 flex items-center py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E07830] animate-pulse" />
                                AI-Powered Youth Mentorship ·
                                mentorship.globalyouthemerge.org
                            </div>

                            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
                                Empowering
                                <br />
                                Africa's youth
                                <br />
                                <span className="text-[#E07830]">
                                    one mentor
                                </span>
                                <br />
                                at a time
                            </h1>

                            <p
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                                className="text-blue-200 text-lg leading-relaxed mb-10 max-w-lg"
                            >
                                Global Youth Emerge connects young people aged
                                15–30 with expert mentors across 10
                                life-changing fields — completely free.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-14">
                                <Link
                                    href="/mentors"
                                    className="bg-[#E07830] text-white font-bold text-base px-8 py-4 rounded-full hover:bg-[#C96820] transition-all hover:scale-105 active:scale-100 shadow-lg text-center"
                                >
                                    Find My Mentor
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="border border-white/30 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-white/10 transition-all flex items-center gap-2 justify-center"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="w-5 h-5"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d="M10 8l6 4-6 4V8z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    See How It Works
                                </a>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-8">
                                {STATS.map((stat) => (
                                    <div key={stat.label}>
                                        <div className="text-2xl font-extrabold text-white">
                                            {stat.value}
                                        </div>
                                        <div
                                            style={{
                                                fontFamily:
                                                    "'DM Sans', sans-serif",
                                            }}
                                            className="text-blue-300 text-xs mt-0.5"
                                        >
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero photo collage */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            {[
                                {
                                    src: "https://globalyouthemerge.org/wp-content/uploads/2025/04/home-1-1024x535.jpg",
                                    tall: true,
                                },
                                {
                                    src: "https://images.unsplash.com/photo-1655720348590-c739c860beed?w=400&h=300&fit=crop&auto=format",
                                    tall: false,
                                },
                                {
                                    src: "https://images.unsplash.com/photo-1584365098838-50ccef838f4a?w=400&h=280&fit=crop&auto=format",
                                    tall: false,
                                },
                                {
                                    src: "https://globalyouthemerge.org/wp-content/uploads/2025/04/home-2-1024x682.jpg",
                                    tall: true,
                                },
                            ].map((photo, i) => (
                                <div
                                    key={i}
                                    className={`rounded-2xl overflow-hidden bg-[#1B4B8A] ${photo.tall ? "row-span-2" : ""}`}
                                    style={{
                                        height: photo.tall ? "320px" : "148px",
                                    }}
                                >
                                    <img
                                        src={photo.src}
                                        alt="Global Youth Emerge community"
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Wave transition */}
                <div className="relative h-16">
                    <svg
                        viewBox="0 0 1440 64"
                        preserveAspectRatio="none"
                        className="absolute bottom-0 w-full h-16"
                        fill="white"
                    >
                        <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" />
                    </svg>
                </div>
            </section>

            {/* ── CATEGORIES ───────────────────────────────────────────── */}
            <section id="mentors" className="py-24 max-w-7xl mx-auto px-6">
                <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="text-[#E07830] text-sm font-bold uppercase tracking-widest mb-3">
                            Explore Mentorship Areas
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D1F3C] leading-tight">
                            10 paths to your
                            <br />
                            best future self
                        </h2>
                    </div>
                    <p
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className="text-[#6B84A3] text-base max-w-sm md:text-right"
                    >
                        Whatever direction you want to grow — we have mentors
                        who have been exactly where you are.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() =>
                                setActiveCategory(
                                    activeCategory === cat.id ? null : cat.id,
                                )
                            }
                            className="group text-left rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus:outline-none"
                            style={{
                                backgroundColor:
                                    activeCategory === cat.id
                                        ? cat.color
                                        : cat.bg,
                                borderColor:
                                    activeCategory === cat.id
                                        ? cat.color
                                        : "transparent",
                            }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                                style={{
                                    backgroundColor:
                                        activeCategory === cat.id
                                            ? "rgba(255,255,255,0.2)"
                                            : cat.color + "22",
                                    color:
                                        activeCategory === cat.id
                                            ? "#fff"
                                            : cat.color,
                                }}
                            >
                                {cat.icon}
                            </div>
                            <div
                                className="font-bold text-sm leading-snug mb-1"
                                style={{
                                    color:
                                        activeCategory === cat.id
                                            ? "#fff"
                                            : "#0D1F3C",
                                }}
                            >
                                {cat.title}
                            </div>
                            <div
                                className="text-xs font-medium mb-2"
                                style={{
                                    color:
                                        activeCategory === cat.id
                                            ? "rgba(255,255,255,0.75)"
                                            : cat.color,
                                }}
                            >
                                {cat.tagline}
                            </div>
                            {activeCategory === cat.id && (
                                <p
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                    className="text-white/85 text-xs leading-relaxed mb-3"
                                >
                                    {cat.desc}
                                </p>
                            )}
                            <div
                                className="text-xs font-semibold"
                                style={{
                                    color:
                                        activeCategory === cat.id
                                            ? "rgba(255,255,255,0.6)"
                                            : "#9CAFC8",
                                }}
                            >
                                {cat.count} mentors available
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
            <section id="how-it-works" className="bg-[#EEF3FA] py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-14 text-center">
                        <div className="text-[#E07830] text-sm font-bold uppercase tracking-widest mb-3">
                            Simple Process
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D1F3C] leading-tight">
                            Three steps to your first session
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {STEPS.map((step, i) => (
                            <div
                                key={step.num}
                                className="relative bg-white rounded-2xl p-8 shadow-sm border border-[#D9E5F5]"
                            >
                                <div className="absolute -top-4 left-8 bg-[#1B4B8A] text-white text-xs font-extrabold px-3 py-1 rounded-full">
                                    STEP {step.num}
                                </div>
                                <div className="text-[#1B4B8A] mb-5 mt-2">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#0D1F3C] mb-3">
                                    {step.title}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                    className="text-[#6B84A3] leading-relaxed text-sm"
                                >
                                    {step.desc}
                                </p>
                                {i < STEPS.length - 1 && (
                                    <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#E07830] rounded-full items-center justify-center shadow-md">
                                        <svg
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            className="w-4 h-4 text-white"
                                        >
                                            <path
                                                d="M4 8h8M8 4l4 4-4 4"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#join"
                            className="bg-[#1B4B8A] text-white font-bold px-10 py-4 rounded-full hover:bg-[#163D72] transition-all hover:scale-105 text-center"
                        >
                            Create Your Free Profile
                        </a>
                        <Link
                            href="/mentors"
                            className="border-2 border-[#1B4B8A] text-[#1B4B8A] font-bold px-10 py-4 rounded-full hover:bg-[#1B4B8A] hover:text-white transition-all text-center"
                        >
                            Browse All Mentors
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FEATURED MENTORS ─────────────────────────────────────── */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="mb-14">
                    <div className="text-[#E07830] text-sm font-bold uppercase tracking-widest mb-3">
                        Featured Mentors
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D1F3C] leading-tight">
                        Learn from those
                        <br />
                        who have done it
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MENTORS.map((mentor) => (
                        <div
                            key={mentor.name}
                            className="group rounded-2xl overflow-hidden border border-[#E2EAF4] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
                        >
                            <div className="relative h-52 bg-[#EEF3FA]">
                                <img
                                    src={mentor.img}
                                    alt={mentor.name}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                                <div
                                    className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
                                    style={{
                                        backgroundColor: mentor.color + "22",
                                        color: mentor.color,
                                    }}
                                >
                                    {mentor.category}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-[#0D1F3C] text-base">
                                    {mentor.name}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                    className="text-[#6B84A3] text-sm mt-0.5 mb-3"
                                >
                                    {mentor.role}
                                </p>
                                <p
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                    className="text-[#4A6080] text-sm italic leading-relaxed mb-4"
                                >
                                    &ldquo;{mentor.quote}&rdquo;
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-1">
                                        <svg
                                            viewBox="0 0 16 16"
                                            className="w-4 h-4 text-[#E07830]"
                                            fill="currentColor"
                                        >
                                            <path d="M8 1l1.97 4.4L15 6.27l-3.5 3.41.83 4.82L8 12.1 3.67 14.5l.83-4.82L1 6.27l5.03-.87L8 1z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-[#0D1F3C]">
                                            {mentor.rating}
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                        className="text-xs text-[#9CAFC8]"
                                    >
                                        {mentor.sessions} sessions
                                    </span>
                                </div>
                                <button
                                    className="w-full py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
                                    style={{
                                        backgroundColor: mentor.color + "18",
                                        color: mentor.color,
                                    }}
                                >
                                    Book a Session
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link
                        href="/mentors"
                        className="border-2 border-[#1B4B8A] text-[#1B4B8A] font-bold px-8 py-4 rounded-full hover:bg-[#1B4B8A] hover:text-white transition-all inline-block"
                    >
                        View All 1,117 Mentors
                    </Link>
                </div>
            </section>

            {/* ── IMPACT ───────────────────────────────────────────────── */}
            <section
                id="impact"
                className="bg-[#0D2B5E] py-24 relative overflow-hidden"
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#1B4B8A] opacity-40 translate-x-1/3 -translate-y-1/4" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E07830] opacity-10 -translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="text-[#E07830] text-sm font-bold uppercase tracking-widest mb-3">
                                Our Impact
                            </div>
                            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
                                Real change,
                                <br />
                                real numbers
                            </h2>
                            <p
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                                className="text-blue-200 text-lg leading-relaxed mb-10"
                            >
                                GYE Mentorship isn't just a platform — it's a
                                movement. Thousands of young people have already
                                changed the trajectory of their lives with one
                                good mentor.
                            </p>
                            <div className="space-y-5">
                                {[
                                    {
                                        label: "Scholarship recipients",
                                        value: "3,200+",
                                        color: "#E07830",
                                        pct: 82,
                                    },
                                    {
                                        label: "Youth-led businesses launched",
                                        value: "890+",
                                        color: "#60A5FA",
                                        pct: 65,
                                    },
                                    {
                                        label: "Tech careers started",
                                        value: "2,100+",
                                        color: "#34D399",
                                        pct: 78,
                                    },
                                    {
                                        label: "Report positive life change",
                                        value: "94%",
                                        color: "#FBBF24",
                                        pct: 94,
                                    },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div className="flex justify-between mb-1.5">
                                            <span
                                                style={{
                                                    fontFamily:
                                                        "'DM Sans', sans-serif",
                                                }}
                                                className="text-blue-200 text-sm"
                                            >
                                                {item.label}
                                            </span>
                                            <span className="font-bold text-white text-sm">
                                                {item.value}
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/10">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${item.pct}%`,
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl overflow-hidden h-96 bg-[#1B4B8A]">
                                <img
                                    src="https://globalyouthemerge.org/wp-content/uploads/2025/04/home-2-1024x682.jpg"
                                    alt="Global Youth Emerge impact"
                                    className="w-full h-full object-cover opacity-85"
                                />
                            </div>
                            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-5 border border-[#E2EAF4]">
                                <div className="text-3xl font-extrabold text-[#1B4B8A]">
                                    94%
                                </div>
                                <p
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                    className="text-[#6B84A3] text-xs mt-1 max-w-35"
                                >
                                    of mentees report a positive life change
                                    within 3 months
                                </p>
                            </div>
                            <div className="absolute -top-5 -right-5 bg-[#E07830] rounded-2xl shadow-xl p-4">
                                <div className="text-2xl font-extrabold text-white">
                                    44
                                </div>
                                <p
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                    className="text-white/80 text-xs mt-0.5"
                                >
                                    Countries
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
            <section id="stories" className="py-24 max-w-7xl mx-auto px-6">
                <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="text-[#E07830] text-sm font-bold uppercase tracking-widest mb-3">
                            Success Stories
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D1F3C] leading-tight">
                            Hear from the youth
                            <br />
                            we have served
                        </h2>
                    </div>
                    <div className="flex gap-2 items-center">
                        {TESTIMONIALS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTestimonial(i)}
                                className="rounded-full transition-all"
                                style={{
                                    width:
                                        i === activeTestimonial
                                            ? "28px"
                                            : "10px",
                                    height: "10px",
                                    backgroundColor:
                                        i === activeTestimonial
                                            ? "#1B4B8A"
                                            : "#CBD5E1",
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <button
                            key={t.name}
                            onClick={() => setActiveTestimonial(i)}
                            className="text-left rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1"
                            style={{
                                backgroundColor:
                                    i === activeTestimonial
                                        ? "#0D2B5E"
                                        : "#FFFFFF",
                                borderColor:
                                    i === activeTestimonial
                                        ? "#1B4B8A"
                                        : "#E2EAF4",
                                transform:
                                    i === activeTestimonial
                                        ? "scale(1.02)"
                                        : "scale(1)",
                                boxShadow:
                                    i === activeTestimonial
                                        ? "0 20px 40px rgba(13,43,94,0.2)"
                                        : "none",
                            }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <img
                                    src={t.img}
                                    alt={t.name}
                                    className="w-12 h-12 rounded-full object-cover bg-[#EEF3FA]"
                                />
                                <div>
                                    <div
                                        className="font-bold text-sm"
                                        style={{
                                            color:
                                                i === activeTestimonial
                                                    ? "#FFFFFF"
                                                    : "#0D1F3C",
                                        }}
                                    >
                                        {t.name}
                                    </div>
                                    <div
                                        className="text-xs mt-0.5"
                                        style={{
                                            color:
                                                i === activeTestimonial
                                                    ? "#93C5FD"
                                                    : "#9CAFC8",
                                        }}
                                    >
                                        {t.location} · Age {t.age}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="text-xs font-semibold uppercase tracking-wider mb-3"
                                style={{
                                    color:
                                        i === activeTestimonial
                                            ? "#E07830"
                                            : "#1B4B8A",
                                }}
                            >
                                {t.category}
                            </div>
                            <p
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    color:
                                        i === activeTestimonial
                                            ? "#BFDBFE"
                                            : "#4A6080",
                                }}
                                className="text-sm leading-relaxed"
                            >
                                &ldquo;{t.text}&rdquo;
                            </p>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── JOIN CTA ──────────────────────────────────────────────── */}
            <section
                id="join"
                className="bg-[#EEF3FA] py-24 relative overflow-hidden"
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#1B4B8A]/10 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#E07830]/5 translate-x-1/3 translate-y-1/3" />
                </div>
                <div className="relative max-w-3xl mx-auto px-6 text-center">
                    <img
                        src={LOGO_URL}
                        alt="Global Youth Emerge"
                        className="h-16 w-auto object-contain mx-auto mb-8 opacity-80"
                    />
                    <div className="inline-flex items-center gap-2 bg-[#E07830]/10 border border-[#E07830]/20 text-[#E07830] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                        Free Forever for Youth · Ages 15–30
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-[#0D1F3C] leading-tight mb-6">
                        Your mentor is
                        <br />
                        waiting for you
                    </h2>
                    <p
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className="text-[#6B84A3] text-lg leading-relaxed mb-10"
                    >
                        Join 12,400+ young people who chose to grow with the
                        right guidance.
                        <br />
                        No cost. No barriers. Just possibility.
                    </p>

                    <div className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8 mb-8">
                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Your full name"
                                className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                            />
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                            />
                            <select className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white">
                                <option value="">Select your age group</option>
                                <option>15–17</option>
                                <option>18–22</option>
                                <option>23–26</option>
                                <option>27–30</option>
                            </select>
                            <select className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white">
                                <option value="">
                                    Mentorship area of interest
                                </option>
                                {CATEGORIES.map((c) => (
                                    <option key={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <button className="w-full bg-[#1B4B8A] text-white font-bold text-base py-4 rounded-full hover:bg-[#163D72] transition-all hover:scale-[1.02] active:scale-100 shadow-md">
                            Join as a Mentee — It's Free
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/become-mentor"
                            className="border-2 border-[#1B4B8A] text-[#1B4B8A] font-bold px-8 py-3.5 rounded-full hover:bg-[#1B4B8A] hover:text-white transition-all text-sm text-center"
                        >
                            Become a Mentor
                        </Link>
                        <a
                            href="https://globalyouthemerge.org"
                            target="_blank"
                            rel="noreferrer"
                            className="border-2 border-[#E07830] text-[#E07830] font-bold px-8 py-3.5 rounded-full hover:bg-[#E07830] hover:text-white transition-all text-sm text-center"
                        >
                            Visit globalyouthemerge.org
                        </a>
                    </div>
                    <p
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className="text-[#9CAFC8] text-xs mt-6"
                    >
                        No registration fee · Cancel anytime · Available across
                        Africa and beyond
                    </p>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────────── */}
            <footer className="bg-[#0D1F3C] text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="text-[#6B84A3] text-sm"
                        >
                            © 2025 Global Youth Emerge ·
                            mentorship.globalyouthemerge.org
                        </p>
                        <div className="flex items-center gap-5">
                            {["Privacy Policy", "Terms of Use", "Cookies"].map(
                                (link) => (
                                    <a
                                        key={link}
                                        href="#"
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                        className="text-[#6B84A3] text-xs hover:text-white transition-colors"
                                    >
                                        {link}
                                    </a>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
