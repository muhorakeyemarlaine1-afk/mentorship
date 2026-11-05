"use client"

import { ReactNode } from "react"
import { useSearchParams } from "next/navigation"

// Both panels stay mounted so switching tabs can't lose the temporary password
// shown after approving an application. The tab lives in the URL via
// pushState, which keeps /mentors?tab=applications linkable without a remount.
export function MentorsTabs({
    pendingApplications,
    mentors,
    applications,
}: {
    pendingApplications: number
    mentors: ReactNode
    applications: ReactNode
}) {
    const showApplications = useSearchParams().get("tab") === "applications"

    const tabClass = (active: boolean) =>
        `-mb-px flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
            active
                ? "border-[#6C4FE0] text-[#6C4FE0]"
                : "border-transparent text-[#6B6690] hover:text-[#171139]"
        }`

    return (
        <div>
            <div
                role="tablist"
                aria-label="Mentors"
                className="mb-6 flex items-center gap-6 border-b border-[#EDEBF6]"
            >
                <button
                    type="button"
                    role="tab"
                    id="mentors-tab"
                    aria-selected={!showApplications}
                    aria-controls="mentors-panel"
                    onClick={() =>
                        window.history.pushState(null, "", "/mentors")
                    }
                    className={tabClass(!showApplications)}
                >
                    Mentors
                </button>
                <button
                    type="button"
                    role="tab"
                    id="applications-tab"
                    aria-selected={showApplications}
                    aria-controls="applications-panel"
                    onClick={() =>
                        window.history.pushState(
                            null,
                            "",
                            "/mentors?tab=applications",
                        )
                    }
                    className={tabClass(showApplications)}
                >
                    Applications
                    {pendingApplications > 0 && (
                        <span className="rounded-full bg-[#EFEAFF] px-2 py-0.5 text-[10px] font-semibold text-[#6C4FE0]">
                            {pendingApplications}
                        </span>
                    )}
                </button>
            </div>

            <div
                role="tabpanel"
                id="mentors-panel"
                aria-labelledby="mentors-tab"
                hidden={showApplications}
            >
                {mentors}
            </div>
            <div
                role="tabpanel"
                id="applications-panel"
                aria-labelledby="applications-tab"
                hidden={!showApplications}
            >
                {applications}
            </div>
        </div>
    )
}
