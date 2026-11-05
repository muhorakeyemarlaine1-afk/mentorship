import { after } from "next/server"
import nodemailer, { type Transporter } from "nodemailer"

let transporter: Transporter | null = null

export function isEmailConfigured() {
    return Boolean(
        process.env.SMTP_HOST &&
            process.env.SMTP_PORT &&
            process.env.SMTP_USER &&
            process.env.SMTP_PASSWORD
    )
}

function getTransporter() {
    if (!isEmailConfigured()) {
        throw new Error("SMTP is not configured.")
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    }

    return transporter
}

export async function sendEmail({
    to,
    subject,
    html,
    text,
}: {
    to: string
    subject: string
    html: string
    text: string
}) {
    await getTransporter().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
        text,
    })
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

export function appUrl(path: string) {
    const base = process.env.APP_URL || "http://localhost:3000"
    return `${base.replace(/\/$/, "")}${path}`
}

export interface EmailContent {
    subject: string
    lines: string[]
    action?: { label: string; path: string }
}

// Lines often hold text from users or public forms, so they're always escaped.
function renderEmail({ lines, action }: EmailContent) {
    const url = action ? appUrl(action.path) : null
    const signOff = "Global Youth Emerge"

    return {
        text: [
            ...lines,
            ...(action ? [`${action.label}: ${url}`] : []),
            signOff,
        ].join("\n\n"),
        html: [
            ...lines.map(
                (line) =>
                    `<p>${escapeHtml(line).replace(/\n/g, "<br>")}</p>`
            ),
            ...(action
                ? [`<p><a href="${escapeHtml(url!)}">${escapeHtml(action.label)}</a></p>`]
                : []),
            `<p>${signOff}</p>`,
        ].join("\n"),
    }
}

/** Sends now and reports whether it worked, for callers with a fallback. */
export async function trySendEmail(to: string, content: EmailContent) {
    if (!isEmailConfigured()) return false

    try {
        await sendEmail({ to, subject: content.subject, ...renderEmail(content) })
        return true
    } catch (error) {
        console.error(`Failed to send email: ${content.subject}`, error)
        return false
    }
}

/**
 * Sends after the response, so a slow mail server can't hold up the request
 * and a failure can't undo work that's already saved. Each address gets its
 * own message, one at a time, so recipients never see each other.
 */
export function queueEmail(to: string | string[], content: EmailContent) {
    const recipients = [to].flat()
    if (recipients.length === 0 || !isEmailConfigured()) return

    after(async () => {
        for (const recipient of recipients) {
            await trySendEmail(recipient, content)
        }
    })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
    await sendEmail({
        to,
        subject: "Reset your password",
        text: `We received a request to reset your password. Use the link below to choose a new one. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
        html: `
            <p>We received a request to reset your password.</p>
            <p><a href="${resetUrl}">Click here to reset your password</a>. This link expires in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
        `,
    })
}
