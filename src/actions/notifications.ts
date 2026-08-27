"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function markNotificationReadAction(id: string, read: boolean) {
    const session = await auth()
    if (!session?.user) return { error: "Not signed in." }

    await prisma.notification.updateMany({
        where: { id, userId: session.user.id },
        data: { read },
    })

    revalidatePath("/notifications")
    return { success: true }
}

export async function markAllNotificationsReadAction() {
    const session = await auth()
    if (!session?.user) return { error: "Not signed in." }

    await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true },
    })

    revalidatePath("/notifications")
    return { success: true }
}

export async function deleteNotificationAction(id: string) {
    const session = await auth()
    if (!session?.user) return { error: "Not signed in." }

    await prisma.notification.deleteMany({
        where: { id, userId: session.user.id },
    })

    revalidatePath("/notifications")
    return { success: true }
}
