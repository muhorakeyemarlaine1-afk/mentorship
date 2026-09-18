import { Users, CalendarClock, Globe2 } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { GetStartedForm } from "@/components/auth/GetStartedForm"

const FEATURES = [
    { icon: Users, label: "Free to join", bg: "#EEF3FA", color: "#1B4B8A" },
    {
        icon: CalendarClock,
        label: "Flexible mentorship",
        bg: "#FEF4EC",
        color: "#E07830",
    },
    {
        icon: Globe2,
        label: "Across Africa and beyond",
        bg: "#EEF3FA",
        color: "#1B4B8A",
    },
]

export default function GetStartedPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-[#0D1F3C]">
            <Navbar />

            <main className="flex-1 pt-16 bg-[#EEF3FA] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#1B4B8A]/10 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#E07830]/5 translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="grid lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5">
                                Your next chapter starts with the{" "}
                                <span className="text-[#E07830]">
                                    right mentor.
                                </span>
                            </h1>
                            <p className="text-[#4A6080] text-lg leading-relaxed mb-8 max-w-md">
                                Connect with experienced mentors, build
                                practical skills, and grow with confidence.
                            </p>

                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-10">
                                {FEATURES.map(
                                    ({ icon: Icon, label, bg, color }) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-2.5"
                                        >
                                            <span
                                                className="flex items-center justify-center size-9 rounded-full shrink-0"
                                                style={{ backgroundColor: bg }}
                                            >
                                                <Icon
                                                    className="size-4.5"
                                                    style={{ color }}
                                                />
                                            </span>
                                            <span className="text-sm font-semibold text-[#0D1F3C]">
                                                {label}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            <p className="hidden lg:block text-[#9CAFC8] text-xs">
                                No registration fee · Cancel anytime ·
                                Available across Africa and beyond
                            </p>
                        </div>

                        <div className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
                            <GetStartedForm />
                        </div>
                    </div>

                    <p className="text-center text-[#9CAFC8] text-xs mt-10 lg:hidden">
                        No registration fee · Cancel anytime · Available
                        across Africa and beyond
                    </p>

                    <p className="text-center mt-10">
                        <a
                            href="https://globalyouthemerge.org"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#6B84A3] text-sm hover:text-[#1B4B8A] transition-colors"
                        >
                            Visit globalyouthemerge.org
                        </a>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
