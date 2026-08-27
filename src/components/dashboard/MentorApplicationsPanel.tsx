"use client"

import { useState, useTransition } from "react"

import {
    approveMentorApplicationAction,
    rejectMentorApplicationAction,
} from "@/actions/users"

export interface ApplicationRow {
    id: string
    name: string
    email: string
    currentRole: string | null
    organization: string | null
    category: string | null
    yearsExperience: string | null
    motivation: string | null
    createdAt: string
}

export function MentorApplicationsPanel({
    applications,
}: {
    applications: ApplicationRow[]
}) {
    const [isPending, startTransition] = useTransition()
    const [pendingId, setPendingId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [credentials, setCredentials] = useState<{
        email: string
        tempPassword: string
    } | null>(null)

    if (applications.length === 0 && !credentials && !error) return null

    function approve(id: string) {
        setError(null)
        setPendingId(id)
        startTransition(async () => {
            const result = await approveMentorApplicationAction(id)
            if (result?.error) setError(result.error)
            if (result?.success) {
                setCredentials({
                    email: result.email!,
                    tempPassword: result.tempPassword!,
                })
            }
            setPendingId(null)
        })
    }

    function reject(id: string) {
        setError(null)
        setPendingId(id)
        startTransition(async () => {
            const result = await rejectMentorApplicationAction(id)
            if (result?.error) setError(result.error)
            setPendingId(null)
        })
    }

    return (
        <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5 mb-6">
            <h2 className="text-base font-bold text-[#171139] mb-1">
                Pending Mentor Applications
            </h2>
            <p className="text-sm text-[#6B6690] mb-4">
                {applications.length} application
                {applications.length === 1 ? "" : "s"} awaiting review.
            </p>

            {error && (
                <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                </p>
            )}

            {credentials && (
                <div className="mb-4 text-sm bg-[#EFEAFF] border border-[#D9CBFF] rounded-xl px-4 py-3">
                    <p className="font-semibold text-[#171139] mb-1">
                        Mentor account created for {credentials.email}
                    </p>
                    <p className="text-[#6B6690]">
                        Temporary password (share this with them — it won&apos;t
                        be shown again):{" "}
                        <span className="font-mono font-semibold text-[#171139]">
                            {credentials.tempPassword}
                        </span>
                    </p>
                    <button
                        onClick={() => setCredentials(null)}
                        className="mt-2 text-xs font-semibold text-[#6C4FE0] hover:underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {applications.map((app) => {
                    const rowBusy = isPending && pendingId === app.id
                    return (
                        <div
                            key={app.id}
                            className="border border-[#EDEBF6] rounded-xl p-4"
                        >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#171139]">
                                        {app.name}
                                    </p>
                                    <p className="text-xs text-[#6B6690]">
                                        {app.email}
                                        {app.currentRole
                                            ? ` · ${app.currentRole}`
                                            : ""}
                                        {app.organization
                                            ? ` at ${app.organization}`
                                            : ""}
                                    </p>
                                    {app.category && (
                                        <p className="text-xs text-[#6C4FE0] font-semibold mt-1">
                                            {app.category}
                                            {app.yearsExperience
                                                ? ` · ${app.yearsExperience}`
                                                : ""}
                                        </p>
                                    )}
                                    {app.motivation && (
                                        <p className="text-xs text-[#6B6690] mt-2 leading-relaxed">
                                            {app.motivation}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => approve(app.id)}
                                        disabled={rowBusy}
                                        className="text-xs font-semibold px-3.5 py-2 rounded-full bg-[#1BA766] text-white hover:bg-[#159057] transition-colors disabled:opacity-60"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => reject(app.id)}
                                        disabled={rowBusy}
                                        className="text-xs font-semibold px-3.5 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
