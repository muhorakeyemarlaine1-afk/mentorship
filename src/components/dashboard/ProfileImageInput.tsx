"use client"

import { useEffect, useRef, useState, type ChangeEvent } from "react"

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

interface ProfileImageInputProps {
    name?: string
    initialImage?: string | null
    error?: string | null
    onChange: (file: File | null) => void
}

export function ProfileImageInput({
    name,
    initialImage,
    error,
    onChange,
}: ProfileImageInputProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(initialImage ?? null)
    const [localError, setLocalError] = useState<string | null>(null)

    useEffect(() => {
        const current = preview
        return () => {
            if (current && current.startsWith("blob:")) {
                URL.revokeObjectURL(current)
            }
        }
    }, [preview])

    function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!ALLOWED_TYPES.includes(file.type)) {
            setLocalError("Please choose a JPEG, PNG, WebP, or GIF image.")
            return
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setLocalError("Image must be smaller than 5MB.")
            return
        }

        setLocalError(null)
        setPreview(URL.createObjectURL(file))
        onChange(file)
    }

    function handleRemove() {
        setLocalError(null)
        setPreview(null)
        onChange(null)
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <div>
            <label className="block text-xs font-semibold text-[#4A6080] mb-1.5">
                Profile photo
            </label>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#EEF3FA] border border-[#D9E5F5] flex items-center justify-center shrink-0">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-lg font-bold text-[#1B4B8A]">
                            {name?.trim()?.[0]?.toUpperCase() ?? "?"}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="text-xs font-semibold text-[#1B4B8A] border border-[#D9E5F5] rounded-full px-4 py-2 hover:bg-[#F6F9FF] transition-colors"
                        >
                            {preview ? "Change photo" : "Upload photo"}
                        </button>
                        {preview && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="text-xs font-semibold text-red-600 border border-red-100 rounded-full px-4 py-2 hover:bg-red-50 transition-colors"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    <p className="text-[11px] text-[#6B84A3]">
                        JPEG, PNG, WebP, or GIF. Max 5MB.
                    </p>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>
            {(localError || error) && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                    {localError || error}
                </p>
            )}
        </div>
    )
}
