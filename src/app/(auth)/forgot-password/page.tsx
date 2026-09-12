import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

export default function ForgotPasswordPage() {
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
                            Password Reset
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0D1F3C] mb-2">
                            Forgot your password?
                        </h1>
                        <p
                            className="text-[#6B84A3] text-sm"
                        >
                            No worries. Enter your email and we&apos;ll send
                            you a link to reset it.
                        </p>
                    </div>

                    <ForgotPasswordForm />

                    <p
                        className="text-center text-[#6B84A3] text-sm mt-6"
                    >
                        Remembered your password?{" "}
                        <Link
                            href="/signin"
                            className="text-[#1B4B8A] font-semibold hover:underline"
                        >
                            Back to sign in
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
