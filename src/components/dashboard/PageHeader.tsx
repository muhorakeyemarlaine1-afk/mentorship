"use client"

import { ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"

export const PAGE_HEADER_SLOT_ID = "page-header-slot"

// Renders the page title + description into the TopNavbar's left slot.
export function PageHeader({
    title,
    description,
}: {
    title: ReactNode
    description?: ReactNode
}) {
    const [slot, setSlot] = useState<HTMLElement | null>(null)

    useEffect(() => {
        setSlot(document.getElementById(PAGE_HEADER_SLOT_ID))
    }, [])

    if (!slot) return null

    return createPortal(
        <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold leading-tight text-[#171139]">
                {title}
            </h1>
            {description && (
                <p className="truncate text-[11px] leading-tight text-[#9C97BE] mt-0.5">
                    {description}
                </p>
            )}
        </div>,
        slot,
    )
}
