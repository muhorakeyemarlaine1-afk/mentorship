import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { signInSchema } from "@/lib/validations/auth"

export const {
    handlers,
    auth,
    signIn,
    signOut,
    unstable_update: update,
} = NextAuth({
    session: { strategy: "jwt" },
    pages: {
        signIn: "/signin",
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsed = signInSchema.safeParse(credentials)
                if (!parsed.success) return null

                const user = await prisma.user.findUnique({
                    where: { email: parsed.data.email },
                })
                if (!user) return null

                const passwordsMatch = await bcrypt.compare(
                    parsed.data.password,
                    user.password
                )
                if (!passwordsMatch) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    mustResetPassword: user.mustResetPassword,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user?.id) {
                token.id = user.id
                token.role = user.role
                token.mustResetPassword = user.mustResetPassword
            }

            if (trigger === "update" && session?.user) {
                token.mustResetPassword = session.user.mustResetPassword
            }

            return token
        },
        async session({ session, token }) {
            session.user.id = token.id
            session.user.role = token.role
            session.user.mustResetPassword = token.mustResetPassword
            return session
        },
    },
})
