"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Bell, LogOut, Loader2, Settings, User } from "lucide-react"

import { logoutAction } from "@/actions/auth"
import {
    Menubar,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"

interface TopNavbarUser {
    name?: string | null
    email?: string | null
    role: "ADMIN" | "MENTOR" | "MENTEE"
}

export function TopNavbar({
    user,
    unreadNotifications = 0,
}: {
    user: TopNavbarUser
    unreadNotifications?: number
}) {
    const router = useRouter()
    const [isSigningOut, startSignOutTransition] = useTransition()

    function handleSignOut() {
        startSignOutTransition(async () => {
            await logoutAction()
        })
    }

    const initial = (user.name ?? user.email ?? "?")[0]?.toUpperCase()

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-end border-b border-[#EDEBF6] bg-white px-6">
            <Menubar className="h-auto gap-1 rounded-full border-none bg-transparent p-0 shadow-none">
                <MenubarMenu>
                    <MenubarTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#6B6690] hover:bg-[#F6F7FB] hover:text-[#171139]">
                        <Bell className="size-4.5" />
                        {unreadNotifications > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E0793F] px-1 text-[10px] font-bold text-white">
                                {unreadNotifications > 9
                                    ? "9+"
                                    : unreadNotifications}
                            </span>
                        )}
                    </MenubarTrigger>
                    <MenubarContent align="end" sideOffset={10}>
                        <MenubarGroup>
                            <MenubarLabel>Notifications</MenubarLabel>
                            <MenubarSeparator />
                            <MenubarItem
                                onClick={() => router.push("/notifications")}
                            >
                                <Bell />
                                {unreadNotifications > 0
                                    ? `${unreadNotifications} unread notification${unreadNotifications === 1 ? "" : "s"}`
                                    : "View all notifications"}
                            </MenubarItem>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger
                        disabled={isSigningOut}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFEAFF] text-sm font-bold text-[#6C4FE0] hover:bg-[#E4DBFF] disabled:opacity-60"
                    >
                        {isSigningOut ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            initial
                        )}
                    </MenubarTrigger>
                    <MenubarContent align="end" sideOffset={10}>
                        <MenubarGroup>
                            <MenubarLabel className="max-w-56">
                                <p className="truncate font-semibold text-[#171139]">
                                    {user.name ?? "Unnamed"}
                                </p>
                                <p className="truncate text-xs font-normal text-[#9C97BE]">
                                    {user.email}
                                </p>
                            </MenubarLabel>
                            <MenubarSeparator />
                            <MenubarItem
                                onClick={() => router.push("/profile")}
                            >
                                <User />
                                Profile
                            </MenubarItem>
                            <MenubarItem
                                onClick={() => router.push("/settings")}
                            >
                                <Settings />
                                Settings
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem
                                variant="destructive"
                                disabled={isSigningOut}
                                closeOnClick={false}
                                onClick={handleSignOut}
                            >
                                {isSigningOut ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <LogOut />
                                )}
                                {isSigningOut
                                    ? "Signing out..."
                                    : "Sign out"}
                            </MenubarItem>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </header>
    )
}
