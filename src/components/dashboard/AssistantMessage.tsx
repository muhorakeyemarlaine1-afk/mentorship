"use client"

import type { ReactNode } from "react"
import { Streamdown } from "streamdown"

import { SparkleIcon } from "@/components/dashboard/icons"

/**
 * AI replies render as Markdown on the page background rather than in a
 * bubble, so lists and longer answers have room. Streamdown copes with the
 * half-finished syntax that arrives mid-stream (an open `**`, a partial list).
 */
export function AssistantMessage({
    text,
    label,
    streaming = false,
    status,
}: {
    text: string
    label: string
    streaming?: boolean
    /** Live progress line ("Thinking…"), shown below any text so far. */
    status?: ReactNode
}) {
    return (
        <div className="flex items-start gap-3 w-full">
            <div className="w-7 h-7 rounded-full bg-[#FEF4EC] text-[#E07830] flex items-center justify-center shrink-0 mt-0.5">
                <SparkleIcon
                    className={`w-3.5 h-3.5 ${
                        streaming
                            ? "animate-spin [animation-duration:2.5s] motion-reduce:animate-none"
                            : ""
                    }`}
                />
            </div>
            <div className="min-w-0 flex-1">
                <span className="block text-[11px] text-[#9C97BE] mb-1">
                    {label}
                </span>
                {text && (
                    <Streamdown
                        mode={streaming ? "streaming" : "static"}
                        isAnimating={streaming}
                        controls={false}
                        className="max-w-[80ch] text-sm leading-relaxed text-[#171139] wrap-break-word space-y-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_a]:text-[#6C4FE0] [&_a]:underline [&_code]:text-[13px]"
                    >
                        {text}
                    </Streamdown>
                )}
                {status && <div className={text ? "mt-2" : ""}>{status}</div>}
            </div>
        </div>
    )
}
