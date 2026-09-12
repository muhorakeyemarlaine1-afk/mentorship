"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { createMentorAction } from "@/actions/mentors"
import { uploadProfileImageAction } from "@/actions/uploads"
import {
    createMentorSchema,
    type CreateMentorInput,
} from "@/lib/validations/mentor"
import { PasswordInput } from "@/components/ui/password-input"
import { ProfileImageInput } from "@/components/dashboard/ProfileImageInput"

export function CreateMentorForm() {
    const [formError, setFormError] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateMentorInput>({
        resolver: zodResolver(createMentorSchema),
    })

    async function onSubmit(values: CreateMentorInput) {
        setFormError(null)

        let image: string | undefined
        if (imageFile) {
            const formData = new FormData()
            formData.append("image", imageFile)
            const uploadResult = await uploadProfileImageAction(formData)
            if (uploadResult?.error) {
                setFormError(uploadResult.error)
                return
            }
            image = uploadResult.url
        }

        const result = await createMentorAction({ ...values, image })
        if (result?.error) {
            setFormError(result.error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-4 mb-6">
                <ProfileImageInput
                    name={watch("name")}
                    onChange={setImageFile}
                />

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

                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Temporary password
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
                    <p className="mt-1.5 text-xs text-[#6B84A3]">
                        The mentor will be asked to reset this on first login.
                    </p>
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
                {isSubmitting ? "Creating..." : "Create Mentor"}
            </button>
        </form>
    )
}
