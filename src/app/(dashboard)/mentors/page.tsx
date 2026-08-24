import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { MentorsList } from "@/components/dashboard/MentorsList"

export default async function MentorsPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const mentors = await prisma.user.findMany({
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
    })

    return (
        <div className="px-8 py-6">
            <MentorsList
                mentors={mentors.map((mentor) => ({
                    ...mentor,
                    createdAt: mentor.createdAt.toISOString(),
                }))}
            />
        </div>
    )
}
