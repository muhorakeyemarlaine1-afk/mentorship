import type { Metadata } from "next"
import Link from "next/link"
import {
    ArrowRight,
    BadgeCheck,
    ChartNoAxesColumnIncreasing,
    CircleCheck,
    CirclePlay,
    Compass,
    Goal,
    HandHeart,
    Rocket,
    ShieldCheck,
    Sprout,
    Target,
    Users,
    UsersRound,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
    title: "Explore Mentorship · Global Youth Emerge",
    description:
        "Mentorship is a space to ask questions, build practical skills and work out what comes next — with someone in your corner.",
}

const WP = "https://globalyouthemerge.org/wp-content/uploads"

const HIGHLIGHTS = [
    {
        title: "Diverse Expertise",
        desc: "Mentors from a wide range of industries and backgrounds.",
        icon: Users,
        color: "#1B6FD8",
    },
    {
        title: "Practical Guidance",
        desc: "Real-world advice and actionable insights.",
        icon: Goal,
        color: "#E07830",
    },
    {
        title: "Meaningful Connections",
        desc: "Build long-lasting professional relationships.",
        icon: HandHeart,
        color: "#7B3FA0",
    },
    {
        title: "Positive Impact",
        desc: "Learn, grow and create new opportunities.",
        icon: ChartNoAxesColumnIncreasing,
        color: "#2E7D32",
    },
]

const JOURNEY = [
    {
        title: "Discover yourself",
        desc: "Understand your interests, strengths and what matters to you.",
        icon: Compass,
    },
    {
        title: "Set your goals",
        desc: "Turn your dreams into clear, achievable goals with expert support.",
        icon: Target,
    },
    {
        title: "Get guidance",
        desc: "Learn from experienced mentors and gain practical advice.",
        icon: UsersRound,
    },
    {
        title: "Take your next step",
        desc: "Build your skills, grow your network and move closer to your future.",
        icon: Rocket,
    },
]

const EXPLORE_POINTS = [
    "Discover your interests",
    "Match your skills to career paths",
    "See personalized recommendations",
    "Get step-by-step next steps",
]

const BENEFITS = [
    {
        title: "Career clarity",
        desc: "Understand your options, explore different paths and make informed decisions.",
        icon: Compass,
    },
    {
        title: "Practical skills",
        desc: "Build in-demand skills through real-world advice and resources.",
        icon: BadgeCheck,
    },
    {
        title: "Confidence",
        desc: "Gain the belief and support to take on new challenges.",
        icon: ShieldCheck,
    },
    {
        title: "Professional connections",
        desc: "Grow your network and open doors to new opportunities.",
        icon: UsersRound,
    },
]

const STATS = [
    { value: "12,000", suffix: "+", label: "Active mentees" },
    { value: "8,500", suffix: "+", label: "Mentors" },
    { value: "85", suffix: "%", label: "Report increased confidence" },
    { value: "72", suffix: "%", label: "Achieved career or education goals" },
]

function Sparks({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            stroke="#E07830"
            strokeWidth="3.5"
            strokeLinecap="round"
            className={className}
            aria-hidden
        >
            <path d="M6 6l10 8M4 21h13M6 36l10-8" />
        </svg>
    )
}

// Climber on a staircase toward a flag — journey section illustration.
function StairsIllustration({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 320 200" fill="none" className={className} aria-hidden>
            <ellipse cx="250" cy="150" rx="70" ry="38" fill="#DCE8F8" />
            <ellipse cx="70" cy="60" rx="34" ry="14" fill="#E8F0FB" />
            <ellipse cx="290" cy="40" rx="26" ry="11" fill="#E8F0FB" />
            <path
                d="M110 190h40v-28h36v-28h36v-28h36v-28h36v112z"
                fill="#1B6FD8"
            />
            <path
                d="M110 190v-6h40v-28h36v-28h36v-28h36v-28h36"
                stroke="#E07830"
                strokeWidth="5"
                strokeLinejoin="round"
            />
            <path d="M282 78V28" stroke="#0D2B5E" strokeWidth="3" />
            <path d="M282 28l24 8-24 8z" fill="#E07830" />
            <circle cx="150" cy="70" r="9" fill="#0D2B5E" />
            <path
                d="M150 80l-6 34M147 92l16 8M147 92l-14 10M144 114l14 16v14M144 114l-12 20-8 0"
                stroke="#1B4B8A"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

// Stylised "Explore Your Future" app window for the career exploration section.
function ExploreMockup() {
    const rows = ["Your Interests", "Your Skills", "Career Paths", "Next Steps"]
    return (
        <div className="relative mx-auto w-full max-w-md py-8">
            <div className="absolute -left-6 bottom-0 w-40 h-40 rounded-full bg-[#DCE8F8]" />
            <Sparks className="absolute -left-2 top-10 w-8 -scale-x-100" />
            <Sparks className="absolute left-20 -top-1 w-7 -rotate-90" />

            <div className="relative ml-8 rounded-2xl bg-white shadow-2xl ring-1 ring-[#E2EAF4] overflow-hidden flex">
                <div className="w-14 sm:w-20 bg-[#1B4B8A] py-6 px-2 space-y-3">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`}
                        />
                    ))}
                </div>
                <div className="flex-1 p-4 sm:p-5">
                    <div className="flex justify-end gap-1 mb-3">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-[#1B4B8A]"
                            />
                        ))}
                    </div>
                    <div className="font-extrabold text-sm text-[#0D2B5E] mb-3">
                        Explore Your Future
                    </div>
                    <div className="space-y-2">
                        {rows.map((row) => (
                            <div
                                key={row}
                                className="flex items-center gap-2 rounded-lg border border-[#E2EAF4] px-3 py-2 text-xs font-semibold text-[#0D2B5E]"
                            >
                                <CircleCheck className="w-3.5 h-3.5 text-[#1B6FD8]" />
                                {row}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-end gap-1 h-12 mt-4 ml-auto w-fit pr-12">
                        {[40, 70, 100].map((h) => (
                            <div
                                key={h}
                                className="w-3 rounded-sm bg-[#1B6FD8]"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute right-0 sm:-right-2 bottom-6 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center">
                <Target className="w-8 h-8 text-[#E07830]" />
            </div>
        </div>
    )
}

export default function ExploreMentorshipPage() {
    return (
        <div className="bg-white text-[#0D1F3C]">
            <Navbar />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="relative pt-16 bg-[#0D2B5E] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1B4B8A] opacity-60" />
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#1B4B8A] opacity-40" />
                    <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full bg-[#1B4B8A] opacity-30" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">
                            Mentorship Platform
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                            Your future.
                            <br />
                            A little clearer.
                            <br />
                            <span className="text-[#F28A3C]">
                                A lot more yours.
                            </span>
                        </h1>
                        <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-10 max-w-md">
                            Mentorship is a space to ask questions, build
                            practical skills and work out what comes next —
                            with someone in your corner.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/get-started"
                                className="bg-[#E07830] text-white font-bold px-7 py-3.5 rounded-full hover:bg-[#C96820] transition-all hover:scale-105 active:scale-100 shadow-lg flex items-center justify-center gap-2"
                            >
                                Start Your Mentorship
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="border border-white/40 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <CirclePlay className="w-5 h-5" />
                                How It Works
                            </Link>
                        </div>
                        <p className="text-white/70 text-sm mt-8">
                            Your future isn&apos;t a straight line. We&apos;re
                            here for the turns.
                        </p>
                    </div>

                    {/* Hero visual: mentee photo + speech bubble + mentor polaroids */}
                    <div className="relative h-80 sm:h-96 lg:h-[26rem]">
                        <div className="absolute left-0 bottom-0 w-[64%] h-[90%] rounded-[2rem] overflow-hidden ring-4 ring-white/10 shadow-2xl">
                            <img
                                src="/images/1.jpg"
                                alt="A young woman smiling while learning a trade"
                                className="w-full h-full object-cover object-[30%_center]"
                            />
                        </div>

                        <div className="absolute right-0 sm:right-6 top-0 bg-white text-[#0D2B5E] text-sm font-medium pl-4 pr-6 py-3 rounded-2xl rounded-bl-sm shadow-xl flex items-center gap-3">
                            <Users className="w-8 h-8 text-[#1B6FD8] shrink-0 fill-[#1B6FD8]" />
                            <span className="leading-snug">
                                Real people.
                                <br />
                                Real guidance.
                                <br />
                                Real impact.
                            </span>
                        </div>
                        <Sparks className="hidden sm:block absolute -right-2 top-20 w-8" />

                        <div className="absolute right-[30%] sm:right-[34%] top-[38%] w-24 sm:w-32 rounded-xl overflow-hidden bg-white p-1.5 shadow-2xl -rotate-3">
                            <img
                                src="/images/mentors/david-otieno.jpg"
                                alt="Mentor David Otieno"
                                className="w-full aspect-[4/5] object-cover rounded-lg"
                            />
                        </div>
                        <div className="absolute right-0 sm:right-4 top-[34%] w-24 sm:w-32 rounded-xl overflow-hidden bg-white p-1.5 shadow-2xl rotate-6">
                            <img
                                src="/images/mentors/amina-mohammed.jpg"
                                alt="Mentor Amina Mohammed"
                                className="w-full aspect-[4/5] object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HIGHLIGHTS ───────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 pt-8">
                <div className="bg-[#EEF3FA] rounded-2xl grid sm:grid-cols-2 lg:grid-cols-4 py-4">
                    {HIGHLIGHTS.map((item, i) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.title}
                                className={`px-6 py-5 text-center ${i > 0 ? "lg:border-l border-[#D9E5F5]" : ""}`}
                            >
                                <Icon
                                    className="w-12 h-12 mx-auto mb-3"
                                    style={{ color: item.color }}
                                />
                                <h3 className="font-extrabold text-[#0D2B5E] mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-[#4A6080]">
                                    {item.desc}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ── JOURNEY ──────────────────────────────────────────────── */}
            <section
                id="journey"
                className="py-16 md:py-20 max-w-7xl mx-auto px-6"
            >
                <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center mb-12">
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#1B4B8A]">
                                Your Mentorship Journey
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32] bg-[#E6F4EA] px-2.5 py-1 rounded-full">
                                <Sprout className="w-3.5 h-3.5" />
                                Recommended
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D2B5E] leading-tight mb-4">
                            From where you are
                            <br />
                            to where you want to be.
                        </h2>
                        <p className="text-[#4A6080] max-w-lg leading-relaxed">
                            A simple, guided journey to help you gain clarity,
                            build skills and take your next step with
                            confidence.
                        </p>
                    </div>
                    <StairsIllustration className="hidden lg:block w-80" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {JOURNEY.map((step, i) => {
                        const Icon = step.icon
                        return (
                            <div key={step.title} className="relative">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-6 h-6 rounded-full bg-[#0D2B5E] text-white text-xs font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    <span className="w-16 h-16 rounded-full bg-[#1B6FD8] text-white flex items-center justify-center shadow-lg shadow-[#1B6FD8]/30">
                                        <Icon className="w-8 h-8" />
                                    </span>
                                    {i < JOURNEY.length - 1 && (
                                        <span className="hidden lg:block flex-1 border-t-2 border-dashed border-[#B7CDEB]" />
                                    )}
                                </div>
                                <h3 className="font-extrabold text-[#0D2B5E] mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-[#4A6080]">
                                    {step.desc}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ── CAREER EXPLORATION ───────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="bg-[#EEF3FA] rounded-3xl p-8 md:p-12 grid lg:grid-cols-2 gap-10 items-center overflow-hidden">
                    <ExploreMockup />
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#1B4B8A] mb-3">
                            Career Exploration
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D2B5E] leading-tight mb-4">
                            Explore your future
                            <br />
                            with confidence.
                        </h2>
                        <p className="text-[#4A6080] leading-relaxed mb-6 max-w-lg">
                            Use our career exploration tools to discover paths
                            that match your interests, skills and goals. Get
                            personalized suggestions and a clear plan for
                            what&apos;s next.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {EXPLORE_POINTS.map((point) => (
                                <li
                                    key={point}
                                    className="flex items-center gap-3 text-sm font-semibold text-[#0D2B5E]"
                                >
                                    <CircleCheck className="w-5 h-5 text-white fill-[#1B4B8A] shrink-0" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/get-started"
                            className="w-fit bg-[#0D2B5E] text-white font-bold px-7 py-3.5 rounded-full hover:bg-[#1B4B8A] transition-all hover:scale-105 active:scale-100 shadow-lg flex items-center gap-2"
                        >
                            Explore Careers
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── KEY BENEFITS ─────────────────────────────────────────── */}
            <section className="py-16 md:py-20 max-w-7xl mx-auto px-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#1B4B8A] mb-3">
                    Key Benefits
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D2B5E] mb-3">
                    What you&apos;ll gain
                </h2>
                <p className="text-[#4A6080] max-w-md leading-relaxed mb-10">
                    More than just advice — get the tools, skills and
                    connections to help you build the future you want.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {BENEFITS.map((benefit) => {
                        const Icon = benefit.icon
                        return (
                            <div
                                key={benefit.title}
                                className="rounded-2xl border border-[#E2EAF4] bg-white shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="w-14 h-14 rounded-full bg-[#EEF3FA] text-[#1B6FD8] flex items-center justify-center mb-5">
                                    <Icon className="w-7 h-7" />
                                </span>
                                <h3 className="font-extrabold text-[#0D2B5E] mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-[#4A6080]">
                                    {benefit.desc}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ── IMPACT ───────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-20">
                <div className="relative rounded-3xl overflow-hidden bg-[#0D2B5E] p-8 md:p-12">
                    <svg
                        viewBox="0 0 200 120"
                        fill="none"
                        className="hidden lg:block absolute right-12 top-8 w-56"
                        aria-hidden
                    >
                        <path
                            d="M10 115L70 60l20 20 35-45 65 80"
                            stroke="#5B8BD1"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <path d="M125 35V5" stroke="#fff" strokeWidth="2" />
                        <path d="M125 5l18 6-18 6z" fill="#E07830" />
                    </svg>
                    <Sparks className="hidden lg:block absolute right-6 top-10 w-8" />

                    <div className="relative">
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-3">
                            The Impact
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                            Real people. Real growth.
                            <br />
                            Lasting impact.
                        </h2>
                        <p className="text-blue-100 max-w-md mb-10">
                            Mentorship changes lives. Here&apos;s what our
                            community has achieved together.
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8">
                            {STATS.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className={`px-4 sm:px-6 ${i % 2 ? "border-l" : ""} ${i > 0 ? "lg:border-l" : ""} border-white/15`}
                                >
                                    <div className="text-3xl md:text-4xl font-extrabold text-[#F28A3C]">
                                        {stat.value}
                                        <span className="text-2xl">
                                            {stat.suffix}
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-100 mt-1 max-w-[10rem]">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <section className="px-4 pb-16">
                <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-[#EEF3FA] grid lg:grid-cols-2">
                    <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#1B4B8A] mb-3">
                            Join Our Community
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D2B5E] leading-tight mb-4">
                            Ready to connect
                            <br />
                            with a mentor?
                        </h2>
                        <p className="text-[#4A6080] mb-8 max-w-md">
                            Create your profile and get matched with a mentor
                            who can support your goals.
                        </p>
                        <Link
                            href="/get-started"
                            className="w-fit bg-[#E07830] text-white font-bold px-7 py-3.5 rounded-full hover:bg-[#C96820] transition-all hover:scale-105 active:scale-100 shadow-lg flex items-center gap-2"
                        >
                            Find My Mentor
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="relative h-64 lg:h-auto">
                        <img
                            src={`${WP}/2025/04/Youth.jpg`}
                            alt="Young people learning together"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#EEF3FA] to-transparent" />
                        <Sparks className="hidden lg:block absolute right-6 top-6 w-10" />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
