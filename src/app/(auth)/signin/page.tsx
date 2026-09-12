import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SignInForm } from "@/components/auth/SignInForm"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

export default function SignInPage() {
    return (
        <div
            className="min-h-screen flex flex-col bg-white text-[#0D1F3C]"
        >
            <Navbar />

            <main className="flex-1 pt-16 bg-[#EEF3FA] relative overflow-hidden flex items-center">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#1B4B8A]/10 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#E07830]/5 translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative max-w-md mx-auto px-6 py-20 w-full">
                    <div className="text-center mb-8">
                        <img
                            src={LOGO_URL}
                            alt="Global Youth Emerge"
                            className="h-14 w-auto object-contain mx-auto mb-6 opacity-90"
                        />
                        <div className="inline-flex items-center gap-2 bg-[#E07830]/10 border border-[#E07830]/20 text-[#E07830] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                            Welcome Back
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0D1F3C] mb-2">
                            Sign in to your account
                        </h1>
                        <p
                            className="text-[#6B84A3] text-sm"
                        >
                            Continue your mentorship journey with Global Youth
                            Emerge.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8">
                        <SignInForm />
                    </div>

                    <p
                        className="text-center text-[#6B84A3] text-sm mt-6"
                    >
                        New to Global Youth Emerge?{" "}
                        <Link
                            href="/get-started"
                            className="text-[#1B4B8A] font-semibold hover:underline"
                        >
                            Get started for free
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
