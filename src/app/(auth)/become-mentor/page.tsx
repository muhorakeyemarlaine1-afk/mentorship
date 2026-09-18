import { Clock, TrendingUp, ShieldCheck } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { BecomeMentorForm } from "@/components/auth/BecomeMentorForm"

const PERKS = [
    {
        icon: Clock,
        title: "Flexible commitment",
        desc: "Mentor as many or as few youth as your schedule allows — from one session a month to weekly office hours.",
    },
    {
        icon: TrendingUp,
        title: "Real impact, tracked",
        desc: "See the outcomes of your mentorship — scholarships won, businesses launched, careers started.",
    },
    {
        icon: ShieldCheck,
        title: "A vetted community",
        desc: "Join 1,100+ mentors from Google, McKinsey, Oxford, and leading African institutions.",
    },
]

export default function BecomeMentorPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-[#0D1F3C]">
            <Navbar />

            <main className="flex-1 pt-16 bg-[#EEF3FA] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#1B4B8A]/10 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#E07830]/5 translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="grid lg:grid-cols-2 gap-14 items-start">
                        {/* Left: pitch */}
                        <div className="lg:sticky lg:top-24">
                            <p className="text-[#E07830] text-xs font-bold uppercase tracking-widest mb-4">
                                Become a mentor
                            </p>
                            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5">
                                Share what you know.{" "}
                                <span className="text-[#E07830]">
                                    Shape someone&apos;s future.
                                </span>
                            </h1>
                            <p className="text-[#4A6080] text-lg leading-relaxed mb-10 max-w-md">
                                Every mentor on Global Youth Emerge was once
                                looking for guidance too. Give an hour a month
                                and help a young African go further, faster.
                            </p>

                            <div className="space-y-6">
                                {PERKS.map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="flex gap-4">
                                        <span className="flex items-center justify-center size-9 rounded-full bg-white border border-[#E2EAF4] shrink-0">
                                            <Icon className="size-4.5 text-[#1B4B8A]" />
                                        </span>
                                        <div>
                                            <div className="font-bold text-[#0D1F3C] text-sm mb-1">
                                                {title}
                                            </div>
                                            <p className="text-[#6B84A3] text-sm leading-relaxed">
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: application form */}
                        <div className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
                            <BecomeMentorForm />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
