"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { updateProfileAction } from "@/actions/settings"
import {
    updateProfileSchema,
    type UpdateProfileInput,
} from "@/lib/validations/settings"

export function ProfileForm({
    defaultValues,
}: {
    defaultValues: UpdateProfileInput
}) {
    const [formError, setFormError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileInput>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues,
    })

    async function onSubmit(values: UpdateProfileInput) {
        setFormError(null)
        setSuccess(false)
        const result = await updateProfileAction(values)
        if (result?.error) {
            setFormError(result.error)
            return
        }
        setSuccess(true)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Full name
                    </label>
                    <input
                        type="text"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>
            </div>

            {formError && (
                <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {formError}
                </p>
            )}
            {success && (
                <p className="mb-4 text-sm font-medium text-[#1BA766] bg-[#E6F7EE] border border-[#C7ECD9] rounded-xl px-4 py-3">
                    Profile updated.
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1B4B8A] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#163D72] transition-all disabled:opacity-60"
            >
                {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
        </form>
    )
}
