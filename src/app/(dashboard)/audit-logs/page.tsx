import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function AuditLogsPage() {
    const session = await auth()
    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
    })

    return (
        <div className="px-8 py-6">
            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                Audit Logs
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                {logs.length} recent action{logs.length === 1 ? "" : "s"}{" "}
                across the platform.
            </p>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] overflow-hidden overflow-x-auto">
                {logs.length === 0 ? (
                    <div className="px-6 py-16 text-center text-sm text-[#6B6690]">
                        No activity logged yet.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#EDEBF6]">
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Actor
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Action
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Target
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Detail
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    When
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="border-b border-[#EDEBF6] last:border-0 hover:bg-[#F6F7FB] transition-colors"
                                >
                                    <td className="px-6 py-3.5 text-sm text-[#171139] whitespace-nowrap">
                                        {log.actorName ??
                                            log.actorEmail ??
                                            "System"}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#171139] whitespace-nowrap">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#6B6690] whitespace-nowrap">
                                        {log.targetType}
                                        {log.targetId
                                            ? ` · ${log.targetId.slice(0, 8)}`
                                            : ""}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#6B6690]">
                                        {log.detail ?? "—"}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-[#9C97BE] whitespace-nowrap">
                                        {log.createdAt.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
