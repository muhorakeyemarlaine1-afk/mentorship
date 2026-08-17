import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

const MENTORSHIP_AREAS = [
    "Career",
    "Entrepreneurship",
    "Education & Scholarships",
    "Financial Literacy",
    "Mental Health & Well-being",
    "Technology",
    "Leadership",
    "Women Empowerment",
    "Life Coaching",
    "Agriculture & Green Economy",
]

const YEARS_OF_EXPERIENCE = [
    "1–3 years",
    "4–7 years",
    "8–15 years",
    "15+ years",
]

const PERKS = [
    {
        title: "Flexible commitment",
        desc: "Mentor as many or as few youth as your schedule allows — from one session a month to weekly office hours.",
    },
    {
        title: "Real impact, tracked",
        desc: "See the outcomes of your mentorship — scholarships won, businesses launched, careers started.",
    },
    {
        title: "A vetted community",
        desc: "Join 1,100+ mentors from Google, McKinsey, Oxford, and leading African institutions.",
    },
]

export default function BecomeMentorPage() {
    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="min-h-screen flex flex-col bg-white text-[#0D1F3C]"
        >
            <Navbar />

            <main className="flex-1 pt-16 bg-[#0D2B5E] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#1B4B8A]/60 translate-x-1/3 -translate-y-1/4" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E07830]/10 -translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-14 items-start">
                    {/* Left: pitch */}
                    <div className="lg:sticky lg:top-24">
                        <img
                            src={LOGO_URL}
                            alt="Global Youth Emerge"
                            className="h-14 w-auto object-contain mb-8 opacity-90"
                        />
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E07830] animate-pulse" />
                            Become a Mentor
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                            Share what you know.
                            <br />
                            Shape someone&apos;s future.
                        </h1>
                        <p
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="text-blue-200 text-base leading-relaxed mb-10 max-w-md"
                        >
                            Every mentor on Global Youth Emerge was once
                            looking for guidance too. Give an hour a month and
                            help a young African go further, faster.
                        </p>

                        <div className="space-y-6">
                            {PERKS.map((perk) => (
                                <div key={perk.title} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-[#E07830]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            className="w-4 h-4 text-[#E07830]"
                                        >
                                            <path
                                                d="M3 8l3.5 3.5L13 5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm mb-1">
                                            {perk.title}
                                        </div>
                                        <p
                                            style={{
                                                fontFamily:
                                                    "'DM Sans', sans-serif",
                                            }}
                                            className="text-blue-200 text-sm leading-relaxed"
                                        >
                                            {perk.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: application form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E2EAF4] p-8">
                        <h2 className="text-xl font-bold text-[#0D1F3C] mb-1">
                            Apply to mentor
                        </h2>
                        <p
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="text-[#6B84A3] text-sm mb-6"
                        >
                            Takes about 5 minutes. Our team reviews every
                            application within 3 business days.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="grid sm:grid-cols-2 gap-4">
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
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Current role"
                                    className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                                />
                                <input
                                    type="text"
                                    placeholder="Organisation / Company"
                                    className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                                />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <select className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white">
                                    <option value="">
                                        Mentorship area of expertise
                                    </option>
                                    {MENTORSHIP_AREAS.map((area) => (
                                        <option key={area}>{area}</option>
                                    ))}
                                </select>
                                <select className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white">
                                    <option value="">
                                        Years of experience
                                    </option>
                                    {YEARS_OF_EXPERIENCE.map((range) => (
                                        <option key={range}>{range}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                placeholder="Tell us why you'd like to mentor African youth, and what you can offer them."
                                rows={4}
                                className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors resize-none"
                            />
                            <input
                                type="url"
                                placeholder="LinkedIn profile (optional)"
                                className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                            />

                            <button className="w-full bg-[#1B4B8A] text-white font-bold text-base py-3.5 rounded-full hover:bg-[#163D72] transition-all hover:scale-[1.02] active:scale-100 shadow-md mt-2">
                                Submit Application
                            </button>
                        </div>

                        <p
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="text-center text-[#6B84A3] text-xs mt-6"
                        >
                            Looking for a mentor instead?{" "}
                            <Link
                                href="/get-started"
                                className="text-[#1B4B8A] font-semibold hover:underline"
                            >
                                Get started as a mentee
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
