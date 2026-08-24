import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Sidebar } from "@/components/dashboard/Sidebar"

export default async function DashboardGroupLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="flex min-h-screen bg-[#F6F7FB] text-[#171139]"
        >
            <Sidebar user={session.user} />
            <main className="flex-1 min-w-0">{children}</main>
        </div>
    )
}
