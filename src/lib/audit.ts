import { prisma } from "@/lib/prisma"

interface Actor {
    name?: string | null
    email?: string | null
}

export async function logAudit(
    actor: Actor | null | undefined,
    action: string,
    targetType: string,
    targetId?: string | null,
    detail?: string | null
) {
    try {
        await prisma.auditLog.create({
            data: {
                actorName: actor?.name ?? null,
                actorEmail: actor?.email ?? null,
                action,
                targetType,
                targetId: targetId ?? null,
                detail: detail ?? null,
            },
        })
    } catch {
        // Audit logging should never break the calling mutation.
    }
}
