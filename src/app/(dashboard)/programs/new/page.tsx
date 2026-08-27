import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { ChevronLeftIcon } from "@/components/dashboard/icons"
import { ProgramForm } from "@/components/dashboard/ProgramForm"

export default async function NewProgramPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    return (
        <div className="px-8 py-6 max-w-2xl">
            <Link
                href="/programs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6690] hover:text-[#171139] transition-colors mb-4"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Programs
            </Link>

            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                New Program
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                Create a mentorship program.
            </p>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <ProgramForm />
            </div>
        </div>
    )
}
