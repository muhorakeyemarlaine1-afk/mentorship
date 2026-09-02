import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/signin")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })
    if (!user) {
        redirect("/signin")
    }

    return (
        <div className="px-8 py-6 max-w-2xl">
            <h1 className="text-2xl font-extrabold text-[#171139] mb-1">
                Profile
            </h1>
            <p className="text-sm text-[#6B6690] mb-6">
                Your account details.
            </p>

            <div className="bg-white rounded-2xl border border-[#EDEBF6] p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#EFEAFF] text-[#6C4FE0] flex items-center justify-center font-bold text-2xl shrink-0">
                        {(user.name ?? user.email)[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-lg font-bold text-[#171139] truncate">
                            {user.name ?? "Unnamed"}
                        </p>
                        <p className="text-sm text-[#6B6690] truncate">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1">
                            Role
                        </p>
                        <p className="text-sm text-[#171139]">
                            {user.role === "ADMIN"
                                ? "Super Administrator"
                                : user.role}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1">
                            Status
                        </p>
                        <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                user.isActive
                                    ? "bg-[#E6F7EE] text-[#1BA766]"
                                    : "bg-[#F1F0FA] text-[#6B6690]"
                            }`}
                        >
                            {user.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                    {user.title && (
                        <div>
                            <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1">
                                Title
                            </p>
                            <p className="text-sm text-[#171139]">
                                {user.title}
                            </p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1">
                            Joined
                        </p>
                        <p className="text-sm text-[#171139]">
                            {user.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {user.bio && (
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-[#6B6690] uppercase tracking-wide mb-1.5">
                            Bio
                        </p>
                        <p className="text-sm text-[#171139] leading-relaxed whitespace-pre-line">
                            {user.bio}
                        </p>
                    </div>
                )}

                <div className="pt-5 border-t border-[#EDEBF6]">
                    <Link
                        href="/settings"
                        className="inline-block bg-[#6C4FE0] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#5B3FD6] transition-all"
                    >
                        Edit in Settings
                    </Link>
                </div>
            </div>
        </div>
    )
}
