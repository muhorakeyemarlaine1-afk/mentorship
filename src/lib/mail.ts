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
