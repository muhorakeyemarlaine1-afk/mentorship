import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeftIcon } from "@/components/dashboard/icons"
import { CreateSessionForm } from "@/components/dashboard/CreateSessionForm"

export default async function NewSessionPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const [mentors, mentees] = await Promise.all([
        prisma.user.findMany({
            where: { role: "MENTOR", isActive: true },
            orderBy: { name: "asc" },
            select: { id: true, name: true, email: true },
        }),
        prisma.user.findMany({
            where: { role: "MENTEE", isActive: true },
            orderBy: { name: "asc" },
            select: { id: true, name: true, email: true },
        }),
    ])

    return (
        <div className="px-8 py-6 max-w-2xl">
            <Link
                href="/sessions"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6690] hover:text-[#171139] transition-colors mb-4"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Sessions
            </Link>

            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                Schedule a Session
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                Pair a mentor and mentee for a session.
            </p>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                {mentors.length === 0 || mentees.length === 0 ? (
                    <p className="text-sm text-[#6B6690]">
                        You need at least one active mentor and one active
                        mentee before you can schedule a session.
                    </p>
                ) : (
                    <CreateSessionForm
                        mentors={mentors.map((m) => ({
                            id: m.id,
                            label: m.name ?? m.email,
                        }))}
                        mentees={mentees.map((m) => ({
                            id: m.id,
                            label: m.name ?? m.email,
                        }))}
                    />
                )}
            </div>
        </div>
    )
}
