import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function ReportsPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const [
        mentorCount,
        menteeCount,
        activeMatches,
        completedSessions,
        scheduledSessions,
        cancelledSessions,
        mentorsByTitle,
    ] = await Promise.all([
        prisma.user.count({ where: { role: "MENTOR" } }),
        prisma.user.count({ where: { role: "MENTEE" } }),
        prisma.mentorMatch.count({ where: { status: "ACCEPTED" } }),
        prisma.mentorshipSession.count({ where: { status: "COMPLETED" } }),
        prisma.mentorshipSession.count({ where: { status: "SCHEDULED" } }),
        prisma.mentorshipSession.count({ where: { status: "CANCELLED" } }),
        prisma.user.groupBy({
            by: ["title"],
            where: { role: "MENTOR", title: { not: null } },
            _count: { _all: true },
            orderBy: { _count: { title: "desc" } },
            take: 8,
        }),
    ])

    const STATS = [
        { label: "Total Mentors", value: mentorCount },
        { label: "Total Mentees", value: menteeCount },
        { label: "Active Matches", value: activeMatches },
        { label: "Sessions Completed", value: completedSessions },
    ]

    const sessionTotal =
        completedSessions + scheduledSessions + cancelledSessions || 1

    const maxTitleCount = Math.max(
        1,
        ...mentorsByTitle.map((row) => row._count._all)
    )

    return (
        <div className="px-8 py-6">
            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                Reports &amp; Analytics
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                Real-time snapshot of platform activity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {STATS.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-2xl border border-[#EDEBF6] p-5"
                    >
                        <p className="text-2xl font-extrabold text-[#171139] mb-1">
                            {stat.value}
                        </p>
                        <p className="text-xs text-[#6B6690]">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5">
                    <h2 className="text-base font-bold text-[#171139] mb-4">
                        Sessions by Status
                    </h2>
                    <div className="flex flex-col gap-3">
                        {[
                            {
                                label: "Completed",
                                value: completedSessions,
                                color: "#1BA766",
                            },
                            {
                                label: "Scheduled",
                                value: scheduledSessions,
                                color: "#3167E0",
                            },
                            {
                                label: "Cancelled",
                                value: cancelledSessions,
                                color: "#E0524A",
                            },
                        ].map((row) => (
                            <div key={row.label}>
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-sm text-[#6B6690]">
                                        {row.label}
                                    </span>
                                    <span className="font-semibold text-[#171139] text-sm">
                                        {row.value}
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-[#F1F0FA]">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(row.value / sessionTotal) * 100}%`,
                                            backgroundColor: row.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5">
                    <h2 className="text-base font-bold text-[#171139] mb-4">
                        Mentors by Focus Area
                    </h2>
                    {mentorsByTitle.length === 0 ? (
                        <p className="text-sm text-[#6B6690]">
                            No mentor titles set yet.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {mentorsByTitle.map((row) => (
                                <div key={row.title}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-sm text-[#6B6690] truncate">
                                            {row.title}
                                        </span>
                                        <span className="font-semibold text-[#171139] text-sm">
                                            {row._count._all}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-[#F1F0FA]">
                                        <div
                                            className="h-full rounded-full bg-[#6C4FE0]"
                                            style={{
                                                width: `${(row._count._all / maxTitleCount) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
