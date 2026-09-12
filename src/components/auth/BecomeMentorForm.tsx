"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { submitMentorApplicationAction } from "@/actions/public"
import {
    mentorApplicationSchema,
    type MentorApplicationInput,
} from "@/lib/validations/application"

const MENTORSHIP_AREAS = [
    "Career",
    "Entrepreneurship",
    "Education & Scholarships",
    "Financial Literacy",
    "Mental Health & Well-being",
    "Technology",
    "Leadership",
    "Women Empowerment",
    "Life Coaching",
    "Agriculture & Green Economy",
]

const YEARS_OF_EXPERIENCE = [
    "1–3 years",
    "4–7 years",
    "8–15 years",
    "15+ years",
]

export function BecomeMentorForm() {
    const [formError, setFormError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<MentorApplicationInput>({
        resolver: zodResolver(mentorApplicationSchema),
    })

    async function onSubmit(values: MentorApplicationInput) {
        setFormError(null)
        const result = await submitMentorApplicationAction(values)
        if (result?.error) {
            setFormError(result.error)
            return
        }
        setSuccess(true)
    }

    if (success) {
        return (
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2EAF4] p-8 text-center">
                <h2 className="text-xl font-bold text-[#0D1F3C] mb-2">
                    Application received 🎉
                </h2>
                <p
                    className="text-[#6B84A3] text-sm"
                >
                    Thank you for applying. Our team reviews every
                    application within 3 business days and will reach out by
                    email once it&apos;s been reviewed.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-[#E2EAF4] p-8">
            <h2 className="text-xl font-bold text-[#0D1F3C] mb-1">
                Apply to mentor
            </h2>
            <p
                className="text-[#6B84A3] text-sm mb-6"
            >
                Takes about 5 minutes. Our team reviews every application
                within 3 business days.
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-4"
            >
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Your full name"
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
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Current role"
                        className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("currentRole")}
                    />
                    <input
                        type="text"
                        placeholder="Organisation / Company"
                        className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("organization")}
                    />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <select
                        className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white"
                        {...register("category")}
                    >
                        <option value="">Mentorship area of expertise</option>
                        {MENTORSHIP_AREAS.map((area) => (
                            <option key={area}>{area}</option>
                        ))}
                    </select>
                    <select
                        className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white"
                        {...register("yearsExperience")}
                    >
                        <option value="">Years of experience</option>
                        {YEARS_OF_EXPERIENCE.map((range) => (
                            <option key={range}>{range}</option>
                        ))}
                    </select>
                </div>
                <textarea
                    placeholder="Tell us why you'd like to mentor African youth, and what you can offer them."
                    rows={4}
                    className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors resize-none"
                    {...register("motivation")}
                />
                <div>
                    <input
                        type="url"
                        placeholder="LinkedIn profile (optional)"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("linkedin")}
                    />
                    {errors.linkedin && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.linkedin.message}
                        </p>
                    )}
                </div>

                {formError && (
                    <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        {formError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1B4B8A] text-white font-bold text-base py-3.5 rounded-full hover:bg-[#163D72] transition-all hover:scale-[1.02] active:scale-100 shadow-md mt-2 disabled:opacity-60 disabled:hover:scale-100"
                >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
            </form>

            <p
                className="text-center text-[#6B84A3] text-xs mt-6"
            >
                Looking for a mentor instead?{" "}
                <Link
                    href="/get-started"
                    className="text-[#1B4B8A] font-semibold hover:underline"
                >
                    Get started as a mentee
                </Link>
            </p>
        </div>
    )
}
