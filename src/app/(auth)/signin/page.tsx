import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SignInForm } from "@/components/auth/SignInForm"

export default function SignInPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-[#0D1F3C]">
            <Navbar />

            <main className="flex-1 pt-16 bg-[#EEF3FA] relative overflow-hidden flex items-center">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#1B4B8A]/10 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#E07830]/5 translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative max-w-lg mx-auto px-6 py-20 w-full">
                    <SignInForm />
                </div>
            </main>

            <Footer />
        </div>
    )
}
