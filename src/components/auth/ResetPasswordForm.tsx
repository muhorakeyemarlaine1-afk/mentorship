"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { resetPasswordAction } from "@/actions/auth"
import {
    resetPasswordSchema,
    type ResetPasswordInput,
} from "@/lib/validations/auth"

export function ResetPasswordForm() {
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    })

    async function onSubmit(values: ResetPasswordInput) {
        setFormError(null)
        const result = await resetPasswordAction(values)
        if (result?.error) {
            setFormError(result.error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        New password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Confirm new password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
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
                {isSubmitting ? "Saving..." : "Set New Password"}
            </button>
        </form>
    )
}
