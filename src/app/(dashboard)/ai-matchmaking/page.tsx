import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { MatchmakingBoard } from "@/components/dashboard/MatchmakingBoard"

function scoreMatch(menteeTitle: string | null, mentorTitle: string | null) {
    if (!menteeTitle || !mentorTitle) return 0
    const a = menteeTitle.toLowerCase().trim()
    const b = mentorTitle.toLowerCase().trim()
    if (a === b) return 2
    const aWords = new Set(a.split(/\s+/))
    const bWords = b.split(/\s+/)
    return bWords.some((w) => aWords.has(w)) ? 1 : 0
}

export default async function AiMatchmakingPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    if (session.user.role !== "ADMIN") {
        const matches = await prisma.mentorMatch.findMany({
            where: {
                status: "ACCEPTED",
                OR: [
                    { mentorId: session.user.id },
                    { menteeId: session.user.id },
                ],
            },
            include: {
                mentor: { select: { name: true, email: true } },
                mentee: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        })

        return (
            <div className="px-8 py-6">
                <MatchmakingBoard
                    unmatched={[]}
                    activeMatches={matches.map((m) => ({
                        id: m.id,
                        mentorName: m.mentor.name ?? m.mentor.email,
                        menteeName: m.mentee.name ?? m.mentee.email,
                        createdAt: m.createdAt.toISOString(),
                    }))}
                    readOnly
                />
            </div>
        )
    }

    const [mentees, mentors, matches] = await Promise.all([
        prisma.user.findMany({
            where: { role: "MENTEE", isActive: true },
            orderBy: { name: "asc" },
        }),
        prisma.user.findMany({
            where: { role: "MENTOR", isActive: true },
            orderBy: { name: "asc" },
        }),
        prisma.mentorMatch.findMany({
            where: { status: "ACCEPTED" },
            include: {
                mentor: { select: { name: true, email: true } },
                mentee: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
    ])

    const matchedMenteeIds = new Set(matches.map((m) => m.menteeId))
    const unmatchedMentees = mentees.filter(
        (mentee) => !matchedMenteeIds.has(mentee.id)
    )

    const unmatched = unmatchedMentees.map((mentee) => {
        const suggestions = mentors
            .map((mentor) => ({
                id: mentor.id,
                name: mentor.name ?? mentor.email,
                title: mentor.title,
                score: scoreMatch(mentee.title, mentor.title),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)

        return {
            id: mentee.id,
            name: mentee.name ?? mentee.email,
            title: mentee.title,
            suggestions,
        }
    })

    return (
        <div className="px-8 py-6">
            <MatchmakingBoard
                unmatched={unmatched}
                activeMatches={matches.map((m) => ({
                    id: m.id,
                    mentorName: m.mentor.name ?? m.mentor.email,
                    menteeName: m.mentee.name ?? m.mentee.email,
                    createdAt: m.createdAt.toISOString(),
                }))}
            />
        </div>
    )
}
