"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { createSessionAction } from "@/actions/sessions"
import {
    createSessionSchema,
    type CreateSessionInput,
} from "@/lib/validations/session"

interface PersonOption {
    id: string
    label: string
}

export function CreateSessionForm({
    mentors,
    mentees,
}: {
    mentors: PersonOption[]
    mentees: PersonOption[]
}) {
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateSessionInput>({
        resolver: zodResolver(createSessionSchema),
        defaultValues: { durationMinutes: 30 },
    })

    async function onSubmit(values: CreateSessionInput) {
        setFormError(null)
        const result = await createSessionAction(values)
        if (result?.error) {
            setFormError(result.error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-4 mb-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                            Mentor
                        </label>
                        <select
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white"
                            {...register("mentorId")}
                        >
                            <option value="">Select a mentor</option>
                            {mentors.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                        {errors.mentorId && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.mentorId.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                            Mentee
                        </label>
                        <select
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white"
                            {...register("menteeId")}
                        >
                            <option value="">Select a mentee</option>
                            {mentees.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                        {errors.menteeId && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.menteeId.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                            Date &amp; time
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                            {...register("scheduledAt")}
                        />
                        {errors.scheduledAt && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.scheduledAt.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            step={15}
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                            {...register("durationMinutes", {
                                valueAsNumber: true,
                            })}
                        />
                        {errors.durationMinutes && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.durationMinutes.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Notes
                    </label>
                    <textarea
                        rows={3}
                        placeholder="What will this session focus on?"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors resize-none"
                        {...register("notes")}
                    />
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
                {isSubmitting ? "Scheduling..." : "Schedule Session"}
            </button>
        </form>
    )
}
