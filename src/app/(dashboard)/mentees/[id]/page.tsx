import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeftIcon, EditIcon } from "@/components/dashboard/icons"
import { MenteeActions } from "@/components/dashboard/MenteeActions"

interface MenteePageProps {
    params: Promise<{ id: string }>
}

export default async function MenteePage({ params }: MenteePageProps) {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const { id } = await params
    const mentee = await prisma.user.findFirst({
        where: { id, role: "MENTEE" },
    })

    if (!mentee) {
        notFound()
    }

    return (
        <div className="px-8 py-6 max-w-3xl">
            <Link
                href="/mentees"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6690] hover:text-[#171139] transition-colors mb-4"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Mentees
            </Link>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#EFEAFF] text-[#6C4FE0] flex items-center justify-center font-bold text-xl shrink-0 overflow-hidden">
                            {mentee.image ? (
                                <img
                                    src={mentee.image}
                                    alt={mentee.name ?? mentee.email}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                (mentee.name ?? mentee.email)[0]?.toUpperCase()
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-xl font-extrabold text-[#171139]">
                                    {mentee.name ?? "Unnamed mentee"}
                                </h1>
                                <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                        mentee.isActive
                                            ? "bg-[#E6F7EE] text-[#1BA766]"
                                            : "bg-[#F1F0FA] text-[#6B6690]"
                                    }`}
                                >
                                    {mentee.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <p className="text-sm text-[#6B6690] mt-0.5">
                                {mentee.title ?? "No title set"}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={`/mentees/${mentee.id}/edit`}
                        className="flex items-center gap-2 border border-[#EDEBF6] text-[#171139] text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#F6F7FB] transition-colors"
                    >
                        <EditIcon className="w-4 h-4" />
                        Edit
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1">
                            Email
                        </p>
                        <p className="text-sm text-[#171139]">
                            {mentee.email}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1">
                            Joined
                        </p>
                        <p className="text-sm text-[#171139]">
                            {mentee.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {mentee.bio && (
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1.5">
                            Bio
                        </p>
                        <p className="text-sm text-[#171139] leading-relaxed whitespace-pre-line">
                            {mentee.bio}
                        </p>
                    </div>
                )}

                <div className="pt-5 border-t border-[#EDEBF6]">
                    <MenteeActions
                        menteeId={mentee.id}
                        isActive={mentee.isActive}
                    />
                </div>
            </div>
        </div>
    )
}
