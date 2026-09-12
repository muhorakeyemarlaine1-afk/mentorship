import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeftIcon } from "@/components/dashboard/icons"
import { EditMenteeForm } from "@/components/dashboard/EditMenteeForm"

interface EditMenteePageProps {
    params: Promise<{ id: string }>
}

export default async function EditMenteePage({
    params,
}: EditMenteePageProps) {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const { id } = await params
    const mentee = await prisma.user.findFirst({
        where: { id, role: "MENTEE" },
    })

    if (!mentee) {
        notFound()
    }

    return (
        <div className="px-8 py-6 max-w-2xl">
            <Link
                href={`/mentees/${mentee.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6690] hover:text-[#171139] transition-colors mb-4"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Mentee
            </Link>

            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                Edit Mentee
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                Update {mentee.name ?? mentee.email}&apos;s profile.
            </p>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <EditMenteeForm
                    menteeId={mentee.id}
                    defaultValues={{
                        name: mentee.name ?? "",
                        email: mentee.email,
                        title: mentee.title ?? "",
                        bio: mentee.bio ?? "",
                        image: mentee.image ?? "",
                    }}
                />
            </div>
        </div>
    )
}
