import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeftIcon } from "@/components/dashboard/icons"
import { EditMentorForm } from "@/components/dashboard/EditMentorForm"
import { PageHeader } from "@/components/dashboard/PageHeader"

interface EditMentorPageProps {
    params: Promise<{ id: string }>
}

export default async function EditMentorPage({ params }: EditMentorPageProps) {
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

            <PageHeader
                title={<>Edit Mentor</>}
                description={
                    <>Update {mentor.name ?? mentor.email}&apos;s profile.</>
                }
            />

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <EditMentorForm
                    mentorId={mentor.id}
                    defaultValues={{
                        name: mentor.name ?? "",
                        email: mentor.email,
                        title: mentor.title ?? "",
                        bio: mentor.bio ?? "",
                        image: mentor.image ?? "",
                    }}
                />
            </div>
        </div>
    )
}
