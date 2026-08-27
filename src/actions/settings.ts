"use server"

import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

import { auth, update } from "@/auth"
import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"
import {
    changePasswordSchema,
    updateProfileSchema,
    type ChangePasswordInput,
    type UpdateProfileInput,
} from "@/lib/validations/settings"

export async function updateProfileAction(values: UpdateProfileInput) {
    const session = await auth()
    if (!session?.user) return { error: "Not signed in." }

    const parsed = updateProfileSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const existing = await prisma.user.findUnique({
        where: { email: parsed.data.email },
    })
    if (existing && existing.id !== session.user.id) {
        return { error: "A user with this email already exists." }
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { name: parsed.data.name, email: parsed.data.email },
    })

    await logAudit(
        { name: parsed.data.name, email: parsed.data.email },
        "Updated own profile",
        "User",
        session.user.id
    )

    revalidatePath("/settings")
    return { success: true }
}

export async function changePasswordAction(values: ChangePasswordInput) {
    const session = await auth()
    if (!session?.user) return { error: "Not signed in." }

    const parsed = changePasswordSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })
    if (!user) return { error: "User not found." }

    const matches = await bcrypt.compare(
        parsed.data.currentPassword,
        user.password
    )
    if (!matches) {
        return { error: "Current password is incorrect." }
    }

    const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, mustResetPassword: false },
    })

    await update({ user: { mustResetPassword: false } })
    await logAudit(user, "Changed own password", "User", user.id)

    return { success: true }
}
