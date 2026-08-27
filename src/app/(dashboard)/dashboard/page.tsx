import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

function relativeTime(date: Date) {
    const diffMs = Date.now() - date.getTime()
    const minutes = Math.floor(diffMs / 60000)
    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

export default async function DashboardPage() {
    const session = await auth()
    const currentUserId = session!.user.id
    const isAdmin = session!.user.role === "ADMIN"

    const [
        totalMentors,
        totalMentees,
        activeMatches,
        sessionsCompleted,
        activeMenteeCount,
        matchedMenteeCount,
        recentActivityRaw,
        recentMentorsRaw,
        recentMenteesRaw,
        recentMessagesRaw,
        pendingApplications,
    ] = await Promise.all([
        prisma.user.count({ where: { role: "MENTOR" } }),
        prisma.user.count({ where: { role: "MENTEE" } }),
        prisma.mentorMatch.count({ where: { status: "ACCEPTED" } }),
        prisma.mentorshipSession.count({ where: { status: "COMPLETED" } }),
        prisma.user.count({ where: { role: "MENTEE", isActive: true } }),
        prisma.mentorMatch.count({
            where: { status: "ACCEPTED", mentee: { isActive: true } },
        }),
        isAdmin
            ? prisma.auditLog.findMany({
                  orderBy: { createdAt: "desc" },
                  take: 5,
              })
            : Promise.resolve([]),
        isAdmin
            ? prisma.user.findMany({
                  where: { role: "MENTOR" },
                  orderBy: { createdAt: "desc" },
                  take: 4,
              })
            : Promise.resolve([]),
        isAdmin
            ? prisma.user.findMany({
                  where: { role: "MENTEE" },
                  orderBy: { createdAt: "desc" },
                  take: 4,
              })
            : Promise.resolve([]),
        prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId },
                    { recipientId: currentUserId },
                ],
            },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                sender: { select: { name: true, email: true } },
                recipient: { select: { name: true, email: true } },
            },
        }),
        isAdmin
            ? prisma.mentorApplication.count({ where: { status: "PENDING" } })
            : Promise.resolve(0),
    ])

    const matchRate =
        activeMenteeCount === 0
            ? 0
            : Math.round((matchedMenteeCount / activeMenteeCount) * 100)

    return (
        <DashboardContent
            adminName={session!.user.name ?? "there"}
            isAdmin={isAdmin}
            stats={{
                totalMentors,
                totalMentees,
                activeMatches,
                sessionsCompleted,
                unmatchedMentees: Math.max(
                    0,
                    activeMenteeCount - matchedMenteeCount
                ),
            }}
            matchRate={matchRate}
            recentActivity={recentActivityRaw.map((log) => ({
                id: log.id,
                action: log.action,
                detail: log.detail,
                createdAt: log.createdAt.toISOString(),
            }))}
            recentMentors={recentMentorsRaw.map((m) => ({
                id: m.id,
                name: m.name ?? m.email,
                role: m.title ?? "Mentor",
                href: `/mentors/${m.id}`,
                isActive: m.isActive,
            }))}
            recentMentees={recentMenteesRaw.map((m) => ({
                id: m.id,
                name: m.name ?? m.email,
                role: m.title ?? "Mentee",
                href: `/mentees/${m.id}`,
                isActive: m.isActive,
            }))}
            recentMessages={recentMessagesRaw.map((m) => {
                const counterpart =
                    m.senderId === currentUserId ? m.recipient : m.sender
                return {
                    id: m.id,
                    counterpartName: counterpart.name ?? counterpart.email,
                    preview: m.content,
                    time: relativeTime(m.createdAt),
                }
            })}
            pendingApplications={pendingApplications}
        />
    )
}
