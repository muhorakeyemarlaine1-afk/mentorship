"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/require-admin"
import { logAudit } from "@/lib/audit"
import { programSchema, type ProgramInput } from "@/lib/validations/program"

export async function createProgramAction(values: ProgramInput) {
    const session = await requireAdmin()

    const parsed = programSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const program = await prisma.program.create({
        data: {
            title: parsed.data.title,
            description: parsed.data.description || null,
            category: parsed.data.category || null,
            status: parsed.data.status,
        },
    })

    await logAudit(session.user, "Created program", "Program", program.id, program.title)

    revalidatePath("/programs")
    redirect(`/programs/${program.id}`)
}

export async function updateProgramAction(id: string, values: ProgramInput) {
    const session = await requireAdmin()

    const parsed = programSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    await prisma.program.update({
        where: { id },
        data: {
            title: parsed.data.title,
            description: parsed.data.description || null,
            category: parsed.data.category || null,
            status: parsed.data.status,
        },
    })

    await logAudit(session.user, "Updated program", "Program", id, parsed.data.title)

    revalidatePath("/programs")
    revalidatePath(`/programs/${id}`)
    redirect(`/programs/${id}`)
}

export async function deleteProgramAction(id: string) {
    const session = await requireAdmin()

    await prisma.program.delete({ where: { id } })
    await logAudit(session.user, "Deleted program", "Program", id)

    revalidatePath("/programs")
    redirect("/programs")
}
