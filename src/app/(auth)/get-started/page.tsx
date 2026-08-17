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

export default function GetStartedPage() {
    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="min-h-screen flex flex-col bg-white text-[#0D1F3C]"
        >
            <Navbar />

            <main className="flex-1 pt-16 bg-[#EEF3FA] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#1B4B8A]/10 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#E07830]/5 translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
                    <img
                        src={LOGO_URL}
                        alt="Global Youth Emerge"
                        className="h-16 w-auto object-contain mx-auto mb-8 opacity-80"
                    />
                    <div className="inline-flex items-center gap-2 bg-[#E07830]/10 border border-[#E07830]/20 text-[#E07830] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                        Free Forever for Youth · Ages 15–30
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#0D1F3C] leading-tight mb-6">
                        Your mentor is
                        <br />
                        waiting for you
                    </h1>
                    <p
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className="text-[#6B84A3] text-lg leading-relaxed mb-10"
                    >
                        Join 12,400+ young people who chose to grow with the
                        right guidance.
                        <br />
                        No cost. No barriers. Just possibility.
                    </p>

                    <div className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8 mb-8 text-left">
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
                                {MENTORSHIP_AREAS.map((area) => (
                                    <option key={area}>{area}</option>
                                ))}
                            </select>
                        </div>
                        <button className="w-full bg-[#1B4B8A] text-white font-bold text-base py-4 rounded-full hover:bg-[#163D72] transition-all hover:scale-[1.02] active:scale-100 shadow-md">
                            Join as a Mentee — It&apos;s Free
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/become-mentor"
                            className="border-2 border-[#1B4B8A] text-[#1B4B8A] font-bold px-8 py-3.5 rounded-full hover:bg-[#1B4B8A] hover:text-white transition-all text-sm"
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
                        No registration fee · Cancel anytime · Available
                        across Africa and beyond
                    </p>

                    <p
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className="text-[#6B84A3] text-sm mt-10"
                    >
                        Already have an account?{" "}
                        <Link
                            href="/signin"
                            className="text-[#1B4B8A] font-semibold hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
