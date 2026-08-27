import * as z from "zod"

export const menteeSignUpSchema = z.object({
    name: z.string().trim().min(1, { error: "Name is required." }),
    email: z.email({ error: "Please enter a valid email." }).trim(),
    ageGroup: z.string().trim().optional(),
    category: z.string().trim().optional(),
    password: z
        .string()
        .min(8, { error: "Be at least 8 characters long." })
        .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
        .regex(/[0-9]/, { error: "Contain at least one number." }),
})

export type MenteeSignUpInput = z.infer<typeof menteeSignUpSchema>

export const mentorApplicationSchema = z.object({
    name: z.string().trim().min(1, { error: "Name is required." }),
    email: z.email({ error: "Please enter a valid email." }).trim(),
    currentRole: z.string().trim().optional(),
    organization: z.string().trim().optional(),
    category: z.string().trim().optional(),
    yearsExperience: z.string().trim().optional(),
    motivation: z.string().trim().optional(),
    linkedin: z
        .union([z.url({ error: "Enter a valid URL." }), z.literal("")])
        .optional(),
})

export type MentorApplicationInput = z.infer<typeof mentorApplicationSchema>
