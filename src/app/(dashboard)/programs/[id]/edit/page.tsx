import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeftIcon } from "@/components/dashboard/icons"
import { ProgramForm } from "@/components/dashboard/ProgramForm"

interface EditProgramPageProps {
    params: Promise<{ id: string }>
}

export default async function EditProgramPage({
    params,
}: EditProgramPageProps) {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const { id } = await params
    const program = await prisma.program.findUnique({ where: { id } })

    if (!program) {
        notFound()
    }

    return (
        <div className="px-8 py-6 max-w-2xl">
            <Link
                href={`/programs/${program.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6690] hover:text-[#171139] transition-colors mb-4"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Program
            </Link>

            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                Edit Program
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                Update {program.title}.
            </p>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <ProgramForm
                    programId={program.id}
                    defaultValues={{
                        title: program.title,
                        description: program.description ?? "",
                        category: program.category ?? "",
                        status: program.status,
                    }}
                />
            </div>
        </div>
    )
}
