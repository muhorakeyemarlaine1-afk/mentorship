import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SessionsList } from "@/components/dashboard/SessionsList"

export default async function SessionsPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const isAdmin = session.user.role === "ADMIN"

    const sessions = await prisma.mentorshipSession.findMany({
        where: isAdmin
            ? undefined
            : {
                  OR: [
                      { mentorId: session.user.id },
                      { menteeId: session.user.id },
                  ],
              },
        orderBy: { scheduledAt: "desc" },
        include: {
            mentor: { select: { name: true, email: true } },
            mentee: { select: { name: true, email: true } },
        },
    })

    return (
        <div className="px-8 py-6">
            <SessionsList
                sessions={sessions.map((s) => ({
                    id: s.id,
                    mentorName: s.mentor.name ?? s.mentor.email,
                    menteeName: s.mentee.name ?? s.mentee.email,
                    scheduledAt: s.scheduledAt.toISOString(),
                    durationMinutes: s.durationMinutes,
                    status: s.status,
                }))}
                canManage={isAdmin}
            />
        </div>
    )
}
