"use client"

import { useTransition } from "react"

import {
    deleteNotificationAction,
    markAllNotificationsReadAction,
    markNotificationReadAction,
} from "@/actions/notifications"
import { TrashIcon } from "@/components/dashboard/icons"

export interface NotificationItem {
    id: string
    title: string
    message: string
    read: boolean
    createdAt: string
}

export function NotificationsList({
    notifications,
}: {
    notifications: NotificationItem[]
}) {
    const [isPending, startTransition] = useTransition()
    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <div>
            <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#171139]">
                        Notifications
                    </h1>
                    <p className="text-sm text-[#6B6690] mt-1">
                        {unreadCount} unread of {notifications.length}.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={() =>
                            startTransition(async () => {
                                await markAllNotificationsReadAction()
                            })
                        }
                        disabled={isPending}
                        className="text-sm font-semibold text-[#6C4FE0] hover:underline disabled:opacity-60"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="px-6 py-16 text-center text-sm text-[#6B6690]">
                        No notifications yet.
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`flex items-start gap-3 px-5 py-4 border-b border-[#EDEBF6] last:border-0 ${
                                n.read ? "" : "bg-[#F6F7FB]"
                            }`}
                        >
                            <span
                                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-transparent" : "bg-[#6C4FE0]"}`}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[#171139]">
                                    {n.title}
                                </p>
                                <p className="text-xs text-[#6B6690] mt-0.5">
                                    {n.message}
                                </p>
                                <p className="text-[11px] text-[#9C97BE] mt-1">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {!n.read && (
                                    <button
                                        onClick={() =>
                                            startTransition(async () => {
                                                await markNotificationReadAction(
                                                    n.id,
                                                    true
                                                )
                                            })
                                        }
                                        disabled={isPending}
                                        className="text-xs font-semibold text-[#6C4FE0] hover:underline disabled:opacity-60"
                                    >
                                        Mark read
                                    </button>
                                )}
                                <button
                                    onClick={() =>
                                        startTransition(async () => {
                                            await deleteNotificationAction(
                                                n.id
                                            )
                                        })
                                    }
                                    disabled={isPending}
                                    className="text-[#9C97BE] hover:text-red-600 transition-colors disabled:opacity-60"
                                    aria-label="Delete notification"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
