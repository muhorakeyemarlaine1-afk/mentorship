import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { MentorsList } from "@/components/dashboard/MentorsList"
import { MentorsTabs } from "@/components/dashboard/MentorsTabs"
import { MentorApplicationsPanel } from "@/components/dashboard/MentorApplicationsPanel"

export default async function MentorsPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const [mentors, applications] = await Promise.all([
        prisma.user.findMany({
            where: { role: "MENTOR" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                title: true,
                isActive: true,
                createdAt: true,
            },
        }),
        prisma.mentorApplication.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "desc" },
        }),
    ])

    return (
        <div className="px-8 py-6">
            <MentorsTabs
                pendingApplications={applications.length}
                mentors={
                    <MentorsList
                        mentors={mentors.map((mentor) => ({
                            ...mentor,
                            createdAt: mentor.createdAt.toISOString(),
                        }))}
                    />
                }
                applications={
                    <MentorApplicationsPanel
                        applications={applications.map((app) => ({
                            ...app,
                            createdAt: app.createdAt.toISOString(),
                        }))}
                    />
                }
            />
        </div>
    )
}
