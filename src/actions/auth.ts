"use server"

import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

import { auth, signIn, signOut, update } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
    resetPasswordSchema,
    signInSchema,
    type ResetPasswordInput,
    type SignInInput,
} from "@/lib/validations/auth"

export async function loginAction(values: SignInInput) {
    const parsed = signInSchema.safeParse(values)
    if (!parsed.success) {
        return { error: "Please enter a valid email and password." }
    }

    try {
        await signIn("credentials", {
            ...parsed.data,
            redirectTo: "/dashboard",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid email or password." }
                default:
                    return { error: "Something went wrong. Please try again." }
            }
        }
        throw error
    }
}

export async function resetPasswordAction(values: ResetPasswordInput) {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/signin")
    }

    const parsed = resetPasswordSchema.safeParse(values)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword, mustResetPassword: false },
    })

    await update({ user: { mustResetPassword: false } })

    redirect("/dashboard")
}

export async function logoutAction() {
    await signOut({ redirectTo: "/signin" })
}
