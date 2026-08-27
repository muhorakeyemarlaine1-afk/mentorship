"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { requestPasswordResetAction } from "@/actions/password-reset"
import {
    forgotPasswordSchema,
    type ForgotPasswordInput,
} from "@/lib/validations/auth"

export function ForgotPasswordForm() {
    const [formError, setFormError] = useState<string | null>(null)
    const [resetUrl, setResetUrl] = useState<string | null | undefined>(
        undefined
    )

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    async function onSubmit(values: ForgotPasswordInput) {
        setFormError(null)
        const result = await requestPasswordResetAction(values)
        if (result?.error) {
            setFormError(result.error)
            return
        }
        setResetUrl(result.resetUrl)
    }

    if (resetUrl !== undefined) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8 text-center">
                <h2 className="text-lg font-bold text-[#0D1F3C] mb-2">
                    Check your request
                </h2>
                {resetUrl ? (
                    <>
                        <p
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="text-[#6B84A3] text-sm mb-4"
                        >
                            This platform doesn&apos;t have email delivery
                            configured yet, so here&apos;s your one-time reset
                            link. It expires in 1 hour.
                        </p>
                        <Link
                            href={resetUrl}
                            className="inline-block bg-[#1B4B8A] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#163D72] transition-all break-all"
                        >
                            Reset my password
                        </Link>
                    </>
                ) : (
                    <p
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className="text-[#6B84A3] text-sm"
                    >
                        If an account exists for that email, a reset link has
                        been generated for it.
                    </p>
                )}
            </div>
        )
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8"
        >
            <div className="mb-6">
                <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                    Email address
                </label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {formError && (
                <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {formError}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B4B8A] text-white font-bold text-base py-3.5 rounded-full hover:bg-[#163D72] transition-all hover:scale-[1.02] active:scale-100 shadow-md disabled:opacity-60 disabled:hover:scale-100"
            >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
        </form>
    )
}
