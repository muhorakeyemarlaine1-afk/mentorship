import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NotificationsList } from "@/components/dashboard/NotificationsList"

export default async function NotificationsPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="px-8 py-6">
            <NotificationsList
                notifications={notifications.map((n) => ({
                    id: n.id,
                    title: n.title,
                    message: n.message,
                    read: n.read,
                    createdAt: n.createdAt.toISOString(),
                }))}
            />
        </div>
    )
}
