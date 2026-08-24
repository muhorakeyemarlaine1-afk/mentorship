"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { updateMentorAction } from "@/actions/mentors"
import {
    updateMentorSchema,
    type UpdateMentorInput,
} from "@/lib/validations/mentor"

interface EditMentorFormProps {
    mentorId: string
    defaultValues: UpdateMentorInput
}

export function EditMentorForm({
    mentorId,
    defaultValues,
}: EditMentorFormProps) {
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateMentorInput>({
        resolver: zodResolver(updateMentorSchema),
        defaultValues,
    })

    async function onSubmit(values: UpdateMentorInput) {
        setFormError(null)
        const result = await updateMentorAction(mentorId, values)
        if (result?.error) {
            setFormError(result.error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Full name
                    </label>
                    <input
                        type="text"
                        placeholder="Jane Doe"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
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
                        placeholder="mentor@example.com"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Title / Expertise
                    </label>
                    <input
                        type="text"
                        placeholder="Leadership Coach"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("title")}
                    />
                    {errors.title && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Bio
                    </label>
                    <textarea
                        rows={4}
                        placeholder="A short bio about this mentor..."
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors resize-none"
                        {...register("bio")}
                    />
                    {errors.bio && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.bio.message}
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
                className="bg-[#1B4B8A] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#163D72] transition-all disabled:opacity-60"
            >
                {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
        </form>
    )
}
