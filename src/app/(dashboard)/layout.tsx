import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopNavbar } from "@/components/dashboard/TopNavbar"

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
            // Chats badge: mentee requests still waiting for a mentor.
            session.user.role === "MENTOR"
                ? prisma.conversation.count({
                      where: {
                          status: "ESCALATED",
                          OR: [
                              { mentorId: null },
                              { mentorId: session.user.id },
                          ],
                          messages: { none: { author: "MENTOR" } },
                      },
                  })
                : Promise.resolve(0),
            session.user.role === "ADMIN"
                ? prisma.mentorApplication.count({
                      where: { status: "PENDING" },
                  })
                : Promise.resolve(0),
        ])

    return (
        <div
            className="flex min-h-screen bg-[#F6F7FB] text-[#171139]"
        >
            <Sidebar
                user={session.user}
                unreadMessages={unreadMessages}
                pendingApplications={pendingApplications}
            />
            <div className="flex-1 min-w-0 flex flex-col">
                <TopNavbar
                    user={session.user}
                    unreadNotifications={unreadNotifications}
                />
                <main className="flex-1 min-w-0 pt-4">{children}</main>
            </div>
        </div>
    )
}
