import { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardGroupLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="flex min-h-screen bg-[#F6F7FB] text-[#171139]"
        >
            <Sidebar />
            <main className="flex-1 min-w-0">{children}</main>
        </div>
    )
}
