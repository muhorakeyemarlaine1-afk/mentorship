"use client"

import { useState, useTransition } from "react"

import { deleteMentorAction, setMentorActiveAction } from "@/actions/mentors"
import { PowerIcon, TrashIcon } from "@/components/dashboard/icons"

interface MentorActionsProps {
    mentorId: string
    isActive: boolean
}

export function MentorActions({ mentorId, isActive }: MentorActionsProps) {
    const [isPending, startTransition] = useTransition()
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    function toggleActive() {
        startTransition(async () => {
            await setMentorActiveAction(mentorId, !isActive)
        })
    }

    function handleDelete() {
        if (!confirmingDelete) {
            setConfirmingDelete(true)
            return
        }
        startTransition(async () => {
            await deleteMentorAction(mentorId)
        })
    }

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={toggleActive}
                disabled={isPending}
                className="flex items-center gap-2 border border-[#EDEBF6] text-[#171139] text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#F6F7FB] transition-colors disabled:opacity-60"
            >
                <PowerIcon className="w-4 h-4" />
                {isActive ? "Set Inactive" : "Set Active"}
            </button>

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
                {confirmingDelete ? "Confirm Delete" : "Delete Mentor"}
            </button>
        </div>
    )
}
