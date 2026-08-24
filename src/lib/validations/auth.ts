import * as z from "zod"

export const signInSchema = z.object({
    email: z.email({ error: "Please enter a valid email." }).trim(),
    password: z.string().min(1, { error: "Password is required." }),
})

export type SignInInput = z.infer<typeof signInSchema>

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, { error: "Be at least 8 characters long." })
            .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
            .regex(/[0-9]/, { error: "Contain at least one number." }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords do not match.",
        path: ["confirmPassword"],
    })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
