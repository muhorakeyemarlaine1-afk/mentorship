import * as z from "zod"

export const updateProfileSchema = z.object({
    name: z.string().trim().min(1, { error: "Name is required." }),
    email: z.email({ error: "Please enter a valid email." }).trim(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, { error: "Current password is required." }),
        newPassword: z
            .string()
            .min(8, { error: "Be at least 8 characters long." })
            .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
            .regex(/[0-9]/, { error: "Contain at least one number." }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        error: "Passwords do not match.",
        path: ["confirmPassword"],
    })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
