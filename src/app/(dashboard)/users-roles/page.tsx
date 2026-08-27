import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { UsersRolesTable } from "@/components/dashboard/UsersRolesTable"
import { MentorApplicationsPanel } from "@/components/dashboard/MentorApplicationsPanel"

export default async function UsersRolesPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const [users, applications] = await Promise.all([
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
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
            <MentorApplicationsPanel
                applications={applications.map((app) => ({
                    ...app,
                    createdAt: app.createdAt.toISOString(),
                }))}
            />
            <UsersRolesTable
                users={users.map((user) => ({
                    ...user,
                    createdAt: user.createdAt.toISOString(),
                }))}
                currentUserId={session.user.id}
            />
        </div>
    )
}
