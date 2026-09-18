"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"

import { loginAction } from "@/actions/auth"
import { signInSchema, type SignInInput } from "@/lib/validations/auth"
import { PasswordInput } from "@/components/ui/password-input"

export function SignInForm() {
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
    })

    async function onSubmit(values: SignInInput) {
        setFormError(null)
        const result = await loginAction(values)
        if (result?.error) {
            setFormError(result.error)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-[#E2EAF4] p-8 text-left">
            <p className="text-[#E07830] text-xs font-bold uppercase tracking-wide mb-2">
                Welcome back
            </p>
            <h2 className="text-2xl font-bold text-[#0D1F3C]">
                Sign in to your account
            </h2>
            <p className="text-[#6B84A3] text-sm mt-1 mb-6">
                Continue your mentorship journey with Global Youth Emerge.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#0D1F3C] mb-1.5">
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

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-[#0D1F3C]">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-semibold text-[#1B4B8A] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
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
                    {isSubmitting ? "Signing in…" : "Sign in"}
                    {!isSubmitting && <ArrowRight className="size-4" />}
                </button>
            </form>

            <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-[#E2EAF4]" />
                <span className="text-xs font-medium text-[#9CAFC8]">or</span>
                <div className="h-px flex-1 bg-[#E2EAF4]" />
            </div>

            <Link
                href="/get-started"
                className="w-full block text-center border-2 border-[#1B4B8A] text-[#1B4B8A] font-bold text-base py-3.5 rounded-full hover:bg-[#1B4B8A] hover:text-white transition-all"
            >
                Create a free account
            </Link>

            <p className="text-center text-[#6B84A3] text-sm mt-6">
                Want to mentor instead?{" "}
                <Link
                    href="/become-mentor"
                    className="text-[#1B4B8A] font-semibold hover:underline"
                >
                    Apply as a mentor
                </Link>
            </p>
        </div>
    )
}
