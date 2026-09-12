"use client"

import { forwardRef, useState, type InputHTMLAttributes } from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    function PasswordInput(
        { className, wrapperClassName, ...props },
        ref
    ) {
        const [visible, setVisible] = useState(false)

        return (
            <div className={cn("relative", wrapperClassName)}>
                <input
                    ref={ref}
                    type={visible ? "text" : "password"}
                    className={cn(
                        "w-full border border-[#D9E5F5] rounded-xl px-4 py-3 pr-11 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors",
                        className
                    )}
                    {...props}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CAFC8] hover:text-[#4A6080] transition-colors"
                >
                    {visible ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </button>
            </div>
        )
    }
)
