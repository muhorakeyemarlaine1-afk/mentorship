import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm"
import { PageHeader } from "@/components/dashboard/PageHeader"

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })
    if (!user) {
        redirect("/signin")
    }

    return (
        <div className="px-8 py-6 max-w-2xl">
            <PageHeader
                title={<>Settings</>}
                description={<>Manage your account details.</>}
            />

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6 mb-6">
                <h2 className="text-base font-bold text-[#171139] mb-4">
                    Profile
                </h2>
                <ProfileForm
                    defaultValues={{
                        name: user.name ?? "",
                        email: user.email,
                    }}
                />
            </div>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <h2 className="text-base font-bold text-[#171139] mb-4">
                    Password
                </h2>
                <ChangePasswordForm />
            </div>
        </div>
    )
}
