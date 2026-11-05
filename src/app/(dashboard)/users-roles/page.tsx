import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { UsersRolesTable } from "@/components/dashboard/UsersRolesTable"

export default async function UsersRolesPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    })

    return (
        <div className="px-8 py-6">
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
