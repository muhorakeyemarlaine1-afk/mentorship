import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProgramsList } from "@/components/dashboard/ProgramsList"

export default async function ProgramsPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const programs = await prisma.program.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="px-8 py-6">
            <ProgramsList
                programs={programs.map((p) => ({
                    id: p.id,
                    title: p.title,
                    category: p.category,
                    status: p.status,
                    createdAt: p.createdAt.toISOString(),
                }))}
                canManage={session.user.role === "ADMIN"}
            />
        </div>
    )
}
