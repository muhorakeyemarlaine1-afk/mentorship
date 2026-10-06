import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { ChevronLeftIcon } from "@/components/dashboard/icons"
import { ProgramForm } from "@/components/dashboard/ProgramForm"
import { PageHeader } from "@/components/dashboard/PageHeader"

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

            <PageHeader
                title={<>New Program</>}
                description={<>Create a mentorship program.</>}
            />

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <ProgramForm />
            </div>
        </div>
    )
}
