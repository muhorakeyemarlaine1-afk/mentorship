"use client"

import { useState, useTransition } from "react"

import { createMatchAction, removeMatchAction } from "@/actions/matches"
import { SparkleIcon, TrashIcon } from "@/components/dashboard/icons"

export interface MentorSuggestion {
    id: string
    name: string
    title: string | null
    score: number
}

export interface UnmatchedMentee {
    id: string
    name: string
    title: string | null
    suggestions: MentorSuggestion[]
}

export interface ActiveMatch {
    id: string
    mentorName: string
    menteeName: string
    createdAt: string
}

export function MatchmakingBoard({
    unmatched,
    activeMatches,
}: {
    unmatched: UnmatchedMentee[]
    activeMatches: ActiveMatch[]
}) {
    const [isPending, startTransition] = useTransition()
    const [busyKey, setBusyKey] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    function match(mentorId: string, menteeId: string) {
        setError(null)
        setBusyKey(`${mentorId}:${menteeId}`)
        startTransition(async () => {
            const result = await createMatchAction(mentorId, menteeId)
            if (result?.error) setError(result.error)
            setBusyKey(null)
        })
    }

    function unmatch(matchId: string) {
        setError(null)
        setBusyKey(matchId)
        startTransition(async () => {
            await removeMatchAction(matchId)
            setBusyKey(null)
        })
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-[#171139] flex items-center gap-2">
                    <SparkleIcon className="w-5 h-5 text-[#6C4FE0]" />
                    AI Matchmaking
                </h1>
                <p className="text-sm text-[#6B6690] mt-1">
                    Suggestions are ranked by shared focus area between an
                    active mentor and an unmatched mentee.
                </p>
            </div>

            {error && (
                <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                </p>
            )}

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5 mb-6">
                <h2 className="text-base font-bold text-[#171139] mb-4">
                    Unmatched Mentees ({unmatched.length})
                </h2>

                {unmatched.length === 0 ? (
                    <p className="text-sm text-[#6B6690]">
                        Every active mentee currently has a match. 🎉
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {unmatched.map((mentee) => (
                            <div
                                key={mentee.id}
                                className="border border-[#EDEBF6] rounded-xl p-4"
                            >
                                <div className="mb-3">
                                    <p className="text-sm font-semibold text-[#171139]">
                                        {mentee.name}
                                    </p>
                                    {mentee.title && (
                                        <p className="text-xs text-[#6B6690]">
                                            Interested in {mentee.title}
                                        </p>
                                    )}
                                </div>

                                {mentee.suggestions.length === 0 ? (
                                    <p className="text-xs text-[#9C97BE]">
                                        No active mentors available to
                                        suggest.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {mentee.suggestions.map(
                                            (mentor) => {
                                                const key = `${mentor.id}:${mentee.id}`
                                                const rowBusy =
                                                    isPending &&
                                                    busyKey === key
                                                return (
                                                    <div
                                                        key={mentor.id}
                                                        className="flex items-center justify-between gap-3 bg-[#F6F7FB] rounded-lg px-3.5 py-2.5"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-[#171139] truncate">
                                                                {mentor.name}
                                                            </p>
                                                            <p className="text-xs text-[#6B6690] truncate">
                                                                {mentor.title ??
                                                                    "No title set"}{" "}
                                                                ·{" "}
                                                                {mentor.score >
                                                                0
                                                                    ? "Shared focus area"
                                                                    : "General match"}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                match(
                                                                    mentor.id,
                                                                    mentee.id
                                                                )
                                                            }
                                                            disabled={rowBusy}
                                                            className="shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full bg-[#6C4FE0] text-white hover:bg-[#5B3FD6] transition-colors disabled:opacity-60"
                                                        >
                                                            {rowBusy
                                                                ? "Matching..."
                                                                : "Match"}
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-5">
                <h2 className="text-base font-bold text-[#171139] mb-4">
                    Active Matches ({activeMatches.length})
                </h2>
                {activeMatches.length === 0 ? (
                    <p className="text-sm text-[#6B6690]">
                        No matches yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {activeMatches.map((m) => {
                            const rowBusy = isPending && busyKey === m.id
                            return (
                                <div
                                    key={m.id}
                                    className="flex items-center justify-between gap-3 border border-[#EDEBF6] rounded-lg px-3.5 py-2.5"
                                >
                                    <p className="text-sm text-[#171139]">
                                        <span className="font-semibold">
                                            {m.mentorName}
                                        </span>{" "}
                                        &amp; {m.menteeName}
                                    </p>
                                    <button
                                        onClick={() => unmatch(m.id)}
                                        disabled={rowBusy}
                                        className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                                    >
                                        <TrashIcon className="w-3.5 h-3.5" />
                                        Unmatch
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
