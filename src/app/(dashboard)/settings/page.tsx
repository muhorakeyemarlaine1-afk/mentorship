import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm"

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
            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                Settings
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                Manage your account details.
            </p>

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
