"use server"

import { requireAdmin } from "@/lib/require-admin"
import { uploadProfileImage } from "@/lib/r2"

export async function uploadProfileImageAction(formData: FormData) {
    await requireAdmin()

    const file = formData.get("image")
    if (!(file instanceof File) || file.size === 0) {
        return { error: "Please choose an image to upload." }
    }

    try {
        const url = await uploadProfileImage(file, "profiles")
        return { url }
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to upload image.",
        }
    }
}
