"use client"

import { useState, useTransition } from "react"

import { deleteSessionAction, setSessionStatusAction } from "@/actions/sessions"
import { TrashIcon } from "@/components/dashboard/icons"

export function SessionActions({
    sessionId,
    status,
}: {
    sessionId: string
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED"
}) {
    const [isPending, startTransition] = useTransition()
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    function setStatus(next: "SCHEDULED" | "COMPLETED" | "CANCELLED") {
        startTransition(async () => {
            await setSessionStatusAction(sessionId, next)
        })
    }

    function handleDelete() {
        if (!confirmingDelete) {
            setConfirmingDelete(true)
            return
        }
        startTransition(async () => {
            await deleteSessionAction(sessionId)
        })
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            {status !== "COMPLETED" && (
                <button
                    onClick={() => setStatus("COMPLETED")}
                    disabled={isPending}
                    className="text-sm font-semibold px-4 py-2.5 rounded-full bg-[#1BA766] text-white hover:bg-[#159057] transition-colors disabled:opacity-60"
                >
                    Mark Completed
                </button>
            )}
            {status !== "CANCELLED" && (
                <button
                    onClick={() => setStatus("CANCELLED")}
                    disabled={isPending}
                    className="text-sm font-semibold px-4 py-2.5 rounded-full border border-[#EDEBF6] text-[#171139] hover:bg-[#F6F7FB] transition-colors disabled:opacity-60"
                >
                    Cancel Session
                </button>
            )}
            {status !== "SCHEDULED" && (
                <button
                    onClick={() => setStatus("SCHEDULED")}
                    disabled={isPending}
                    className="text-sm font-semibold px-4 py-2.5 rounded-full border border-[#EDEBF6] text-[#171139] hover:bg-[#F6F7FB] transition-colors disabled:opacity-60"
                >
                    Reopen
                </button>
            )}
            <button
                onClick={handleDelete}
                onBlur={() => setConfirmingDelete(false)}
                disabled={isPending}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition-colors disabled:opacity-60 ${
                    confirmingDelete
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "border border-red-200 text-red-600 hover:bg-red-50"
                }`}
            >
                <TrashIcon className="w-4 h-4" />
                {confirmingDelete ? "Confirm Delete" : "Delete Session"}
            </button>
        </div>
    )
}
