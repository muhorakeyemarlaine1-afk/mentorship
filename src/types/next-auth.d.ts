import type { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        role: "ADMIN" | "MENTOR" | "MENTEE"
        mustResetPassword: boolean
    }

    interface Session {
        user: {
            id: string
            role: "ADMIN" | "MENTOR" | "MENTEE"
            mustResetPassword: boolean
        } & DefaultSession["user"]
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id: string
        role: "ADMIN" | "MENTOR" | "MENTEE"
        mustResetPassword: boolean
    }
}
