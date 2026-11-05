"use server"

import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"
import {
    appUrl,
    isEmailConfigured,
    queueEmail,
    sendPasswordResetEmail,
} from "@/lib/mail"
import { passwordChangedEmail } from "@/lib/emails"
import {
    CLEAR_PASSWORD_TOKEN,
    RESET_TOKEN_TTL_MS,
    createPasswordToken,
    hashPasswordToken,
} from "@/lib/password-tokens"
import {
    forgotPasswordSchema,
    resetPasswordSchema,
    type ForgotPasswordInput,
    type ResetPasswordInput,
} from "@/lib/validations/auth"

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

    const resetPath = await createPasswordToken(user.id, RESET_TOKEN_TTL_MS)

    await logAudit(null, "Requested password reset", "User", user.id)

    if (isEmailConfigured()) {
        await sendPasswordResetEmail(user.email, appUrl(resetPath))
        return { success: true as const, resetUrl: null }
    }

    // Fall back to surfacing the link directly when SMTP isn't configured.
    return { success: true as const, resetUrl: resetPath }
}

export async function resetPasswordWithTokenAction(
    token: string,
    values: ResetPasswordInput
) {
    const parsed = resetPasswordSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const tokenHash = hashPasswordToken(token)
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
            ...CLEAR_PASSWORD_TOKEN,
        },
    })

    await logAudit(null, "Reset password via link", "User", user.id)

    // An invited user setting their first password isn't a change to report.
    if (!user.mustResetPassword) {
        queueEmail(user.email, passwordChangedEmail())
    }

    return { success: true }
}
