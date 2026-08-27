import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function BillingPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const [mentorCount, menteeCount, adminCount] = await Promise.all([
        prisma.user.count({ where: { role: "MENTOR" } }),
        prisma.user.count({ where: { role: "MENTEE" } }),
        prisma.user.count({ where: { role: "ADMIN" } }),
    ])

    const totalSeats = mentorCount + menteeCount + adminCount

    return (
        <div className="px-8 py-6 max-w-3xl">
            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                Billing &amp; Plans
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                Your current plan and platform usage.
            </p>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6 mb-6">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                    <h2 className="text-lg font-bold text-[#171139]">
                        Free Forever Plan
                    </h2>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#E6F7EE] text-[#1BA766]">
                        Active
                    </span>
                </div>
                <p className="text-sm text-[#6B6690]">
                    Global Youth Emerge Mentorship is free for youth and
                    mentors — there&apos;s no paid tier or billing configured
                    for this platform.
                </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                {[
                    { label: "Mentors", value: mentorCount },
                    { label: "Mentees", value: menteeCount },
                    { label: "Admins", value: adminCount },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-2xl border border-[#EDEBF6] p-5"
                    >
                        <p className="text-2xl font-extrabold text-[#171139] mb-1">
                            {stat.value}
                        </p>
                        <p className="text-xs text-[#6B6690]">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            <p className="text-xs text-[#9C97BE] mt-6">
                {totalSeats} total account{totalSeats === 1 ? "" : "s"} on the
                platform. No payment provider is connected — this page
                reflects real usage, not billing charges.
            </p>
        </div>
    )
}
