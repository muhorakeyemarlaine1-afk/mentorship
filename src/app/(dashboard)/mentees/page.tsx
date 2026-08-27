import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { MenteesList } from "@/components/dashboard/MenteesList"

export default async function MenteesPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const mentees = await prisma.user.findMany({
        where: { role: "MENTEE" },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            title: true,
            isActive: true,
            createdAt: true,
        },
    })

    return (
        <div className="px-8 py-6">
            <MenteesList
                mentees={mentees.map((mentee) => ({
                    ...mentee,
                    createdAt: mentee.createdAt.toISOString(),
                }))}
            />
        </div>
    )
}
