import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeftIcon } from "@/components/dashboard/icons"
import { SessionActions } from "@/components/dashboard/SessionActions"

interface SessionPageProps {
    params: Promise<{ id: string }>
}

const STATUS_STYLES: Record<string, string> = {
    SCHEDULED: "bg-[#E7F0FF] text-[#3167E0]",
    COMPLETED: "bg-[#E6F7EE] text-[#1BA766]",
    CANCELLED: "bg-[#FDECEA] text-[#B71C1C]",
}

export default async function SessionPage({ params }: SessionPageProps) {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const isAdmin = session.user.role === "ADMIN"

    const { id } = await params
    const mentorshipSession = await prisma.mentorshipSession.findUnique({
        where: { id },
        include: { mentor: true, mentee: true },
    })

    if (!mentorshipSession) {
        notFound()
    }

    const isParticipant =
        mentorshipSession.mentorId === session.user.id ||
        mentorshipSession.menteeId === session.user.id
    if (!isAdmin && !isParticipant) {
        redirect("/sessions")
    }

    return (
        <div className="px-8 py-6 max-w-3xl">
            <Link
                href="/sessions"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6690] hover:text-[#171139] transition-colors mb-4"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Sessions
            </Link>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-extrabold text-[#171139]">
                                {mentorshipSession.mentor.name ??
                                    mentorshipSession.mentor.email}{" "}
                                &amp;{" "}
                                {mentorshipSession.mentee.name ??
                                    mentorshipSession.mentee.email}
                            </h1>
                            <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[mentorshipSession.status]}`}
                            >
                                {mentorshipSession.status}
                            </span>
                        </div>
                        <p className="text-sm text-[#6B6690] mt-1">
                            {mentorshipSession.scheduledAt.toLocaleString()} ·{" "}
                            {mentorshipSession.durationMinutes} minutes
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1">
                            Mentor
                        </p>
                        <p className="text-sm text-[#171139]">
                            {mentorshipSession.mentor.email}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1">
                            Mentee
                        </p>
                        <p className="text-sm text-[#171139]">
                            {mentorshipSession.mentee.email}
                        </p>
                    </div>
                </div>

                {mentorshipSession.notes && (
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1.5">
                            Notes
                        </p>
                        <p className="text-sm text-[#171139] leading-relaxed whitespace-pre-line">
                            {mentorshipSession.notes}
                        </p>
                    </div>
                )}

                {isAdmin && (
                    <div className="pt-5 border-t border-[#EDEBF6]">
                        <SessionActions
                            sessionId={mentorshipSession.id}
                            status={mentorshipSession.status}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
