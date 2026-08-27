import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { BecomeMentorForm } from "@/components/auth/BecomeMentorForm"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

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
                    <BecomeMentorForm />
                </div>
            </main>

            <Footer />
        </div>
    )
}
