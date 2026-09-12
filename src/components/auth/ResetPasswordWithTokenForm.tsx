"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { resetPasswordWithTokenAction } from "@/actions/password-reset"
import {
    resetPasswordSchema,
    type ResetPasswordInput,
} from "@/lib/validations/auth"
import { PasswordInput } from "@/components/ui/password-input"

export function ResetPasswordWithTokenForm({ token }: { token: string }) {
    const [formError, setFormError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    })

    async function onSubmit(values: ResetPasswordInput) {
        setFormError(null)
        const result = await resetPasswordWithTokenAction(token, values)
        if (result?.error) {
            setFormError(result.error)
            return
        }
        setSuccess(true)
    }

    if (success) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8 text-center">
                <h2 className="text-lg font-bold text-[#0D1F3C] mb-2">
                    Password updated 🎉
                </h2>
                <p
                    className="text-[#6B84A3] text-sm mb-6"
                >
                    You can now sign in with your new password.
                </p>
                <Link
                    href="/signin"
                    className="inline-block bg-[#1B4B8A] text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-[#163D72] transition-all"
                >
                    Sign In
                </Link>
            </div>
        )
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8"
        >
            <div className="flex flex-col gap-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        New password
                    </label>
                    <PasswordInput
                        placeholder="••••••••"
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
                    <PasswordInput
                        placeholder="••••••••"
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
