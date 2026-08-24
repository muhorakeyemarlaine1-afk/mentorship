import { NextResponse } from "next/server"

import { auth } from "@/auth"

const PROTECTED_PREFIXES = ["/dashboard", "/chats", "/mentors"]
const RESET_PASSWORD_PATH = "/reset-password"
const SIGNIN_PATH = "/signin"
const DEFAULT_AUTHENTICATED_PATH = "/dashboard"

export default auth((req) => {
    const { nextUrl } = req
    const path = nextUrl.pathname
    const isLoggedIn = !!req.auth
    const mustResetPassword = req.auth?.user?.mustResetPassword

    const isProtectedRoute = PROTECTED_PREFIXES.some(
        (prefix) => path === prefix || path.startsWith(`${prefix}/`)
    )

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL(SIGNIN_PATH, nextUrl))
    }

    if (isLoggedIn && mustResetPassword && path !== RESET_PASSWORD_PATH) {
        return NextResponse.redirect(new URL(RESET_PASSWORD_PATH, nextUrl))
    }

    if (isLoggedIn && !mustResetPassword && path === RESET_PASSWORD_PATH) {
        return NextResponse.redirect(
            new URL(DEFAULT_AUTHENTICATED_PATH, nextUrl)
        )
    }

    if (isLoggedIn && !mustResetPassword && path === SIGNIN_PATH) {
        return NextResponse.redirect(
            new URL(DEFAULT_AUTHENTICATED_PATH, nextUrl)
        )
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
