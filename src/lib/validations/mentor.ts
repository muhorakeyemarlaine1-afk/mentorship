import * as z from "zod"

export const createMentorSchema = z.object({
    name: z.string().trim().min(1, { error: "Name is required." }),
    email: z.email({ error: "Please enter a valid email." }).trim(),
    title: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    image: z.string().trim().optional(),
    password: z
        .string()
        .min(8, { error: "Be at least 8 characters long." })
        .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
        .regex(/[0-9]/, { error: "Contain at least one number." }),
})

export type CreateMentorInput = z.infer<typeof createMentorSchema>

export const updateMentorSchema = z.object({
    name: z.string().trim().min(1, { error: "Name is required." }),
    email: z.email({ error: "Please enter a valid email." }).trim(),
    title: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    image: z.string().trim().optional(),
})

export type UpdateMentorInput = z.infer<typeof updateMentorSchema>
