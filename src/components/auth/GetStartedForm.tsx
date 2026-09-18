"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"

import { signUpMenteeAction } from "@/actions/public"
import {
    menteeSignUpSchema,
    type MenteeSignUpInput,
} from "@/lib/validations/application"
import { PasswordInput } from "@/components/ui/password-input"

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
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8 text-center">
                <h2 className="text-xl font-bold text-[#0D1F3C] mb-2">
                    You&apos;re in! 🎉
                </h2>
                <p className="text-[#6B84A3] text-sm mb-6">
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
        <div className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8 text-left">
            <p className="text-[#E07830] text-xs font-bold uppercase tracking-wide mb-2">
                Join as a mentee
            </p>
            <h2 className="text-2xl font-bold text-[#0D1F3C]">
                Create your account
            </h2>
            <p className="text-[#6B84A3] text-sm mt-1 mb-6">
                Start your mentorship journey in just a few steps.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#0D1F3C] mb-1.5">
                        Full name
                    </label>
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

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#0D1F3C] mb-1.5">
                        Email address
                    </label>
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

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#0D1F3C] mb-1.5">
                            Age group
                        </label>
                        <select
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white"
                            {...register("ageGroup")}
                        >
                            <option value="">Select your age group</option>
                            {AGE_GROUPS.map((group) => (
                                <option key={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#0D1F3C] mb-1.5">
                            Mentorship area of interest
                        </label>
                        <select
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white"
                            {...register("category")}
                        >
                            <option value="">
                                Mentorship area of interest
                            </option>
                            {MENTORSHIP_AREAS.map((area) => (
                                <option key={area}>{area}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#0D1F3C] mb-1.5">
                        Create a password
                    </label>
                    <PasswordInput
                        placeholder="Create a password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <label className="flex items-start gap-2.5 mb-6 cursor-pointer">
                    <input
                        type="checkbox"
                        required
                        className="mt-0.5 size-4 rounded border-[#D9E5F5] text-[#1B4B8A] focus:ring-[#1B4B8A] cursor-pointer"
                    />
                    <span className="text-sm text-[#4A6080]">
                        I agree to the{" "}
                        <a
                            href="#"
                            className="text-[#1B4B8A] font-semibold hover:underline"
                        >
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                            href="#"
                            className="text-[#1B4B8A] font-semibold hover:underline"
                        >
                            Privacy Policy
                        </a>
                    </span>
                </label>

                {formError && (
                    <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        {formError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#1B4B8A] text-white font-bold text-base py-4 rounded-full hover:bg-[#163D72] transition-all hover:scale-[1.02] active:scale-100 shadow-md disabled:opacity-60 disabled:hover:scale-100"
                >
                    {isSubmitting ? "Creating your account…" : "Create free account"}
                    {!isSubmitting && <ArrowRight className="size-4" />}
                </button>
            </form>

            <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-[#E2EAF4]" />
                <span className="text-xs font-medium text-[#9CAFC8]">or</span>
                <div className="h-px flex-1 bg-[#E2EAF4]" />
            </div>

            <Link
                href="/become-mentor"
                className="w-full block text-center border-2 border-[#1B4B8A] text-[#1B4B8A] font-bold text-base py-3.5 rounded-full hover:bg-[#1B4B8A] hover:text-white transition-all"
            >
                Join as a mentor
            </Link>

            <p className="text-center text-[#6B84A3] text-sm mt-6">
                Already have an account?{" "}
                <Link
                    href="/signin"
                    className="text-[#1B4B8A] font-semibold hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </div>
    )
}
