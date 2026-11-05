import crypto from "crypto"

import { prisma } from "@/lib/prisma"

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour
export const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function hashPasswordToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex")
}

/** Stores a single-use token and returns the path that redeems it. */
export async function createPasswordToken(userId: string, ttlMs: number) {
    const token = crypto.randomBytes(32).toString("base64url")

    await prisma.user.update({
        where: { id: userId },
        data: {
            passwordResetTokenHash: hashPasswordToken(token),
            passwordResetTokenExpiresAt: new Date(Date.now() + ttlMs),
        },
    })

    return `/reset-password/${token}`
}

/** Spread into a user update to invalidate any outstanding link. */
export const CLEAR_PASSWORD_TOKEN = {
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
}
