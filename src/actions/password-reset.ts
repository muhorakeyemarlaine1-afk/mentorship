"use server"

import bcrypt from "bcryptjs"
import crypto from "crypto"

import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"
import {
    forgotPasswordSchema,
    resetPasswordSchema,
    type ForgotPasswordInput,
    type ResetPasswordInput,
} from "@/lib/validations/auth"

const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex")
}

export async function requestPasswordResetAction(values: ForgotPasswordInput) {
    const parsed = forgotPasswordSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
    })

    // Don't reveal whether the email exists.
    if (!user) {
        return { success: true as const, resetUrl: null }
    }

    const token = crypto.randomBytes(32).toString("base64url")
    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordResetTokenHash: hashToken(token),
            passwordResetTokenExpiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
    })

    await logAudit(null, "Requested password reset", "User", user.id)

    return { success: true as const, resetUrl: `/reset-password/${token}` }
}

export async function resetPasswordWithTokenAction(
    token: string,
    values: ResetPasswordInput
) {
    const parsed = resetPasswordSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const tokenHash = hashToken(token)
    const user = await prisma.user.findFirst({
        where: {
            passwordResetTokenHash: tokenHash,
            passwordResetTokenExpiresAt: { gt: new Date() },
        },
    })

    if (!user) {
        return { error: "This reset link is invalid or has expired." }
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            mustResetPassword: false,
            passwordResetTokenHash: null,
            passwordResetTokenExpiresAt: null,
        },
    })

    await logAudit(null, "Reset password via link", "User", user.id)

    return { success: true }
}
