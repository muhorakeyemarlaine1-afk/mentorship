"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signUpMenteeAction } from "@/actions/public"
import {
    menteeSignUpSchema,
    type MenteeSignUpInput,
} from "@/lib/validations/application"

const AGE_GROUPS = ["15–17", "18–22", "23–26", "27–30"]

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

export function GetStartedForm() {
    const [formError, setFormError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<MenteeSignUpInput>({
        resolver: zodResolver(menteeSignUpSchema),
    })

    async function onSubmit(values: MenteeSignUpInput) {
        setFormError(null)
        const result = await signUpMenteeAction(values)
        if (result?.error) {
            setFormError(result.error)
            return
        }
        setSuccess(true)
    }

    if (success) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8 mb-8 text-center">
                <h2 className="text-xl font-bold text-[#0D1F3C] mb-2">
                    You&apos;re in! 🎉
                </h2>
                <p
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    className="text-[#6B84A3] text-sm mb-6"
                >
                    Your mentee account has been created. Sign in to complete
                    your profile and get matched with a mentor.
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
            className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8 mb-8 text-left"
        >
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
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
                <select
                    className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white"
                    {...register("ageGroup")}
                >
                    <option value="">Select your age group</option>
                    {AGE_GROUPS.map((group) => (
                        <option key={group}>{group}</option>
                    ))}
                </select>
                <select
                    className="border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white"
                    {...register("category")}
                >
                    <option value="">Mentorship area of interest</option>
                    {MENTORSHIP_AREAS.map((area) => (
                        <option key={area}>{area}</option>
                    ))}
                </select>
                <input
                    type="password"
                    placeholder="Create a password"
                    className="sm:col-span-2 border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="sm:col-span-2 -mt-2.5 text-xs font-medium text-red-600">
                        {errors.password.message}
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
                className="w-full bg-[#1B4B8A] text-white font-bold text-base py-4 rounded-full hover:bg-[#163D72] transition-all hover:scale-[1.02] active:scale-100 shadow-md disabled:opacity-60 disabled:hover:scale-100"
            >
                {isSubmitting
                    ? "Creating your account..."
                    : "Join as a Mentee — It's Free"}
            </button>
        </form>
    )
}
