import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeftIcon, EditIcon } from "@/components/dashboard/icons"
import { DeleteProgramButton } from "@/components/dashboard/DeleteProgramButton"

interface ProgramPageProps {
    params: Promise<{ id: string }>
}

const STATUS_STYLES: Record<string, string> = {
    ACTIVE: "bg-[#E6F7EE] text-[#1BA766]",
    DRAFT: "bg-[#F1F0FA] text-[#6B6690]",
    ARCHIVED: "bg-[#FDECEA] text-[#B71C1C]",
}

export default async function ProgramPage({ params }: ProgramPageProps) {
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
        <div className="px-8 py-6 max-w-3xl">
            <Link
                href="/programs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6690] hover:text-[#171139] transition-colors mb-4"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Programs
            </Link>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-extrabold text-[#171139]">
                                {program.title}
                            </h1>
                            <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[program.status]}`}
                            >
                                {program.status}
                            </span>
                        </div>
                        {program.category && (
                            <p className="text-sm text-[#6C4FE0] font-semibold mt-1">
                                {program.category}
                            </p>
                        )}
                    </div>

                    <Link
                        href={`/programs/${program.id}/edit`}
                        className="flex items-center gap-2 border border-[#EDEBF6] text-[#171139] text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#F6F7FB] transition-colors"
                    >
                        <EditIcon className="w-4 h-4" />
                        Edit
                    </Link>
                </div>

                {program.description && (
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1.5">
                            Description
                        </p>
                        <p className="text-sm text-[#171139] leading-relaxed whitespace-pre-line">
                            {program.description}
                        </p>
                    </div>
                )}

                <div className="pt-5 border-t border-[#EDEBF6]">
                    <DeleteProgramButton programId={program.id} />
                </div>
            </div>
        </div>
    )
}
