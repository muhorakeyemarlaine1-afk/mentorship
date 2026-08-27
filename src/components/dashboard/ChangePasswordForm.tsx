"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { changePasswordAction } from "@/actions/settings"
import {
    changePasswordSchema,
    type ChangePasswordInput,
} from "@/lib/validations/settings"

export function ChangePasswordForm() {
    const [formError, setFormError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
    })

    async function onSubmit(values: ChangePasswordInput) {
        setFormError(null)
        setSuccess(false)
        const result = await changePasswordAction(values)
        if (result?.error) {
            setFormError(result.error)
            return
        }
        setSuccess(true)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Current password
                    </label>
                    <input
                        type="password"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("currentPassword")}
                    />
                    {errors.currentPassword && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.currentPassword.message}
                        </p>
                    )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                            New password
                        </label>
                        <input
                            type="password"
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                            {...register("newPassword")}
                        />
                        {errors.newPassword && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                            Confirm new password
                        </label>
                        <input
                            type="password"
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {formError && (
                <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {formError}
                </p>
            )}
            {success && (
                <p className="mb-4 text-sm font-medium text-[#1BA766] bg-[#E6F7EE] border border-[#C7ECD9] rounded-xl px-4 py-3">
                    Password changed.
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1B4B8A] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#163D72] transition-all disabled:opacity-60"
            >
                {isSubmitting ? "Saving..." : "Change Password"}
            </button>
        </form>
    )
}
