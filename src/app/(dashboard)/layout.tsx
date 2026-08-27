import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/dashboard/Sidebar"

export default async function DashboardGroupLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const [unreadNotifications, unreadMessages, pendingApplications] =
        await Promise.all([
            prisma.notification.count({
                where: { userId: session.user.id, read: false },
            }),
            prisma.message.count({
                where: { recipientId: session.user.id, readAt: null },
            }),
            session.user.role === "ADMIN"
                ? prisma.mentorApplication.count({
                      where: { status: "PENDING" },
                  })
                : Promise.resolve(0),
        ])

    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="flex min-h-screen bg-[#F6F7FB] text-[#171139]"
        >
            <Sidebar
                user={session.user}
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                pendingApplications={pendingApplications}
            />
            <main className="flex-1 min-w-0">{children}</main>
        </div>
    )
}
