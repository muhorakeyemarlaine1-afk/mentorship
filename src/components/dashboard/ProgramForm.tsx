"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { createProgramAction, updateProgramAction } from "@/actions/programs"
import { programSchema, type ProgramInput } from "@/lib/validations/program"

export function ProgramForm({
    programId,
    defaultValues,
}: {
    programId?: string
    defaultValues?: ProgramInput
}) {
    const [formError, setFormError] = useState<string | null>(null)
    const isEdit = Boolean(programId)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProgramInput>({
        resolver: zodResolver(programSchema),
        defaultValues: defaultValues ?? { status: "ACTIVE" },
    })

    async function onSubmit(values: ProgramInput) {
        setFormError(null)
        const result = isEdit
            ? await updateProgramAction(programId!, values)
            : await createProgramAction(values)
        if (result?.error) {
            setFormError(result.error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Title
                    </label>
                    <input
                        type="text"
                        placeholder="Tech Career Accelerator"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                        {...register("title")}
                    />
                    {errors.title && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                            Category
                        </label>
                        <input
                            type="text"
                            placeholder="Technology"
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors"
                            {...register("category")}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                            Status
                        </label>
                        <select
                            className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] focus:outline-none focus:border-[#1B4B8A] transition-colors bg-white"
                            {...register("status")}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="DRAFT">Draft</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                        Description
                    </label>
                    <textarea
                        rows={4}
                        placeholder="What does this program offer?"
                        className="w-full border border-[#D9E5F5] rounded-xl px-4 py-3 text-sm text-[#0D1F3C] placeholder-[#9CAFC8] focus:outline-none focus:border-[#1B4B8A] transition-colors resize-none"
                        {...register("description")}
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
                {isSubmitting
                    ? "Saving..."
                    : isEdit
                      ? "Save Changes"
                      : "Create Program"}
            </button>
        </form>
    )
}
