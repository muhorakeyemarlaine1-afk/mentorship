import * as z from "zod"

export const programSchema = z.object({
    title: z.string().trim().min(1, { error: "Title is required." }),
    description: z.string().trim().optional(),
    category: z.string().trim().optional(),
    status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
})

export type ProgramInput = z.infer<typeof programSchema>
