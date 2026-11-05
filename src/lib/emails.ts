import type { EmailContent } from "@/lib/mail"

const ROLE_LABELS = { ADMIN: "an admin", MENTOR: "a mentor", MENTEE: "a mentee" }

export function mentorApplicationEmail(application: {
    name: string
    email: string
    currentRole: string | null
    organization: string | null
    category: string | null
    yearsExperience: string | null
    motivation: string | null
    linkedin: string | null
}): EmailContent {
    const details = [
        ["Name", application.name],
        ["Email", application.email],
        ["Current role", application.currentRole],
        ["Organization", application.organization],
        ["Category", application.category],
        ["Experience", application.yearsExperience],
        ["LinkedIn", application.linkedin],
        ["Motivation", application.motivation],
    ].filter((row): row is [string, string] => Boolean(row[1]))

    return {
        subject: `New mentor application: ${application.name}`,
        lines: [
            `${application.name} applied to become a mentor.`,
            details.map(([label, value]) => `${label}: ${value}`).join("\n"),
        ],
        action: {
            label: "Review the application",
            path: "/mentors?tab=applications",
        },
    }
}

export function applicationReceivedEmail(name: string): EmailContent {
    return {
        subject: "We received your mentor application",
        lines: [
            `Hi ${name},`,
            "Thanks for applying to become a mentor. Our team will review your application and email you with the outcome.",
        ],
    }
}

export function applicationRejectedEmail(name: string): EmailContent {
    return {
        subject: "Your mentor application",
        lines: [
            `Hi ${name},`,
            "Thank you for applying to become a mentor. After reviewing your application, we aren't able to move forward with it at this time.",
            "We appreciate your interest in supporting young people.",
        ],
    }
}

export function welcomeEmail(name: string): EmailContent {
    return {
        subject: "Welcome to Global Youth Emerge",
        lines: [
            `Hi ${name},`,
            "Your mentee account is ready. Sign in to find a mentor and start a conversation.",
        ],
        action: { label: "Sign in", path: "/signin" },
    }
}

export function inviteEmail(
    name: string | null,
    role: "MENTOR" | "MENTEE",
    setPasswordPath: string
): EmailContent {
    return {
        subject: "Your account is ready: set your password",
        lines: [
            `Hi ${name ?? "there"},`,
            `You've been added to Global Youth Emerge as ${ROLE_LABELS[role]}. Choose a password to finish setting up your account.`,
            "This link expires in 7 days. After that, use \"Forgot password\" on the sign-in page to get a new one.",
        ],
        action: { label: "Set your password", path: setPasswordPath },
    }
}

export function passwordChangedEmail(): EmailContent {
    return {
        subject: "Your password was changed",
        lines: [
            "The password on your account was just changed.",
            "If this was you, there's nothing else to do. If it wasn't, reset your password now and contact an admin.",
        ],
        action: { label: "Reset your password", path: "/forgot-password" },
    }
}

export function emailChangedEmail(newEmail: string): EmailContent {
    return {
        subject: "Your account email was changed",
        lines: [
            `The email address on your account was changed to ${newEmail}. You'll no longer receive messages at this address.`,
            "If you didn't expect this, contact an admin right away.",
        ],
    }
}

export function accountStatusEmail(isActive: boolean): EmailContent {
    return isActive
        ? {
              subject: "Your account was reactivated",
              lines: ["An admin reactivated your account. You can sign in again."],
              action: { label: "Sign in", path: "/signin" },
          }
        : {
              subject: "Your account was deactivated",
              lines: [
                  "An admin deactivated your account. If you think this is a mistake, please contact an admin.",
              ],
          }
}

export function roleChangedMessage(role: keyof typeof ROLE_LABELS) {
    return `An admin changed your role. You're now ${ROLE_LABELS[role]}.`
}
