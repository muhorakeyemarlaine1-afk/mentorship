import type { Metadata } from "next"
import Link from "next/link"
import {
    ArrowRight,
    ChartNoAxesColumnIncreasing,
    CirclePlay,
    Goal,
    HandHeart,
    Users,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
    title: "Our Mentors · Global Youth Emerge",
    description:
        "Experienced professionals, entrepreneurs and changemakers passionate about supporting young people to learn, grow and create opportunities.",
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

// Hardcoded showcase — no longer sourced from the database.
const MENTORS = [
    {
        name: "Grace Wanjiku",
        role: "Investment Analyst",
        org: "East Africa Capital",
        img: "/images/mentors/grace-wanjiku.jpg",
        tags: ["Finance", "Investments", "Career Growth"],
        bio: "Passionate about helping young people explore careers in finance and develop practical skills for the workplace.",
    },
    {
        name: "David Otieno",
        role: "Software Engineer",
        org: "TechNova Africa",
        img: "/images/mentors/david-otieno.jpg",
        tags: ["Technology", "Digital Skills", "Innovation"],
        bio: "Experienced software engineer supporting young people to build tech skills and navigate the tech industry.",
    },
    {
        name: "Amina Mohammed",
        role: "Social Impact Leader",
        org: "ChangeMakers Kenya",
        img: "/images/mentors/amina-mohammed.jpg",
        tags: ["Leadership", "Social Impact", "Youth Development"],
        bio: "Focused on empowering young people to create solutions to real community challenges.",
    },
    {
        name: "Brian Karanja",
        role: "Entrepreneur",
        org: "Kijani Ventures",
        img: "/images/mentors/brian-karanja.jpg",
        tags: ["Entrepreneurship", "Business", "Innovation"],
        bio: "Entrepreneur and business mentor supporting young people to turn ideas into sustainable ventures.",
    },
    {
        name: "Nana Adisa",
        role: "Product Manager",
        org: "GlobalTech Solutions",
        img: "/images/mentors/nana-adisa.jpg",
        tags: ["Technology", "Product Management", "Career Growth"],
        bio: "Product manager with a passion for mentoring young people on building successful careers in tech and beyond.",
    },
    {
        name: "Samuel Mwangi",
        role: "Environmental Consultant",
        org: "GreenFuture Africa",
        img: "/images/mentors/samuel-mwangi.jpg",
        tags: ["Sustainability", "Environment", "Social Impact"],
        bio: "Environment and sustainability expert supporting young people interested in climate action and green careers.",
    },
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

export default function OurMentorsPage() {
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
                            Our Mentors
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                            Guidance from
                            <br />
                            <span className="text-[#F28A3C]">
                                people who&apos;ve
                                <br />
                                been there.
                            </span>
                        </h1>
                        <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-10 max-w-md">
                            Our mentors are experienced professionals,
                            entrepreneurs, and changemakers who are passionate
                            about supporting young people to learn, grow, and
                            create opportunities for their future.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#mentors"
                                className="bg-[#E07830] text-white font-bold px-7 py-3.5 rounded-full hover:bg-[#C96820] transition-all hover:scale-105 active:scale-100 shadow-lg flex items-center justify-center gap-2"
                            >
                                Meet Our Mentors
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <Link
                                href="/how-it-works"
                                className="border border-white/40 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <CirclePlay className="w-5 h-5" />
                                Hear from Our Mentors
                            </Link>
                        </div>
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
                                Real experience.
                                <br />
                                Real impact.
                            </span>
                        </div>
                        <Sparks className="hidden sm:block absolute -right-2 top-20 w-8" />

                        <div className="absolute right-[30%] sm:right-[34%] top-[38%] w-24 sm:w-32 rounded-xl overflow-hidden bg-white p-1.5 shadow-2xl -rotate-3">
                            <img
                                src="/images/mentors/david-otieno.jpg"
                                alt="David Otieno"
                                className="w-full aspect-[4/5] object-cover rounded-lg"
                            />
                        </div>
                        <div className="absolute right-0 sm:right-4 top-[34%] w-24 sm:w-32 rounded-xl overflow-hidden bg-white p-1.5 shadow-2xl rotate-6">
                            <img
                                src="/images/mentors/amina-mohammed.jpg"
                                alt="Amina Mohammed"
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

            {/* ── MENTORS ──────────────────────────────────────────────── */}
            <section
                id="mentors"
                className="py-16 md:py-20 max-w-7xl mx-auto px-6 scroll-mt-16"
            >
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D2B5E]">
                        Meet some of Our Mentors
                    </h2>
                    <p className="text-[#4A6080] text-lg mt-2">
                        Discover experienced mentors who are ready to support
                        you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MENTORS.map((mentor) => (
                        <div
                            key={mentor.name}
                            className="rounded-2xl border border-[#E2EAF4] bg-white shadow-sm p-3 flex gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <img
                                src={mentor.img}
                                alt={mentor.name}
                                className="w-32 sm:w-36 shrink-0 self-start aspect-[2/3] object-cover rounded-xl bg-[#EEF3FA]"
                            />
                            <div className="py-1 pr-1 min-w-0">
                                <h3 className="font-extrabold text-[#0D2B5E]">
                                    {mentor.name}
                                </h3>
                                <p className="text-sm text-[#4A6080]">
                                    {mentor.role}
                                </p>
                                <p className="text-sm text-[#6B84A3] mb-3">
                                    {mentor.org}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {mentor.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-medium text-[#1B4B8A] bg-[#EEF3FA] px-2.5 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs leading-relaxed text-[#4A6080]">
                                    {mentor.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <section className="px-4 pb-16">
                <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-[#0D2B5E] grid lg:grid-cols-2">
                    <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                            Ready to connect
                            <br />
                            <span className="text-[#F28A3C]">
                                with a mentor?
                            </span>
                        </h2>
                        <p className="text-blue-100 mb-8 max-w-md">
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
                        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0D2B5E] to-transparent" />
                        <Sparks className="hidden lg:block absolute right-6 top-6 w-10" />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
