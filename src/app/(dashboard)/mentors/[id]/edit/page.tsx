import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeftIcon } from "@/components/dashboard/icons"
import { EditMentorForm } from "@/components/dashboard/EditMentorForm"

interface EditMentorPageProps {
    params: Promise<{ id: string }>
}

export default async function EditMentorPage({
    params,
}: EditMentorPageProps) {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const { id } = await params
    const mentor = await prisma.user.findFirst({
        where: { id, role: "MENTOR" },
    })

    if (!mentor) {
        notFound()
    }

    return (
        <div className="px-8 py-6 max-w-2xl">
            <Link
                href={`/mentors/${mentor.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6690] hover:text-[#171139] transition-colors mb-4"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Mentor
            </Link>

            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                Edit Mentor
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                Update {mentor.name ?? mentor.email}&apos;s profile.
            </p>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <EditMentorForm
                    mentorId={mentor.id}
                    defaultValues={{
                        name: mentor.name ?? "",
                        email: mentor.email,
                        title: mentor.title ?? "",
                        bio: mentor.bio ?? "",
                    }}
                />
            </div>
        </div>
    )
}
