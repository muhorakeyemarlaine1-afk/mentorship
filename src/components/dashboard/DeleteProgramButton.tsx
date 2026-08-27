"use client"

import { useState, useTransition } from "react"

import { deleteProgramAction } from "@/actions/programs"
import { TrashIcon } from "@/components/dashboard/icons"

export function DeleteProgramButton({ programId }: { programId: string }) {
    const [isPending, startTransition] = useTransition()
    const [confirming, setConfirming] = useState(false)

    function handleDelete() {
        if (!confirming) {
            setConfirming(true)
            return
        }
        startTransition(async () => {
            await deleteProgramAction(programId)
        })
    }

    return (
        <button
            onClick={handleDelete}
            onBlur={() => setConfirming(false)}
            disabled={isPending}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition-colors disabled:opacity-60 ${
                confirming
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border border-red-200 text-red-600 hover:bg-red-50"
            }`}
        >
            <TrashIcon className="w-4 h-4" />
            {confirming ? "Confirm Delete" : "Delete Program"}
        </button>
    )
}
