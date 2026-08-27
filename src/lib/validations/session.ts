import * as z from "zod"

export const createSessionSchema = z.object({
    mentorId: z.string().min(1, { error: "Select a mentor." }),
    menteeId: z.string().min(1, { error: "Select a mentee." }),
    scheduledAt: z.string().min(1, { error: "Pick a date and time." }),
    durationMinutes: z
        .number()
        .int()
        .min(15, { error: "At least 15 minutes." })
        .max(480, { error: "At most 8 hours." }),
    notes: z.string().trim().optional(),
})

export type CreateSessionInput = z.infer<typeof createSessionSchema>
