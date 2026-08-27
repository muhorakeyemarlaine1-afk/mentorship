"use client"

import { useMemo, useState, useTransition } from "react"

import {
    deleteUserAction,
    setUserActiveAction,
    updateUserRoleAction,
} from "@/actions/users"
import { SearchIcon, TrashIcon } from "@/components/dashboard/icons"

export interface UserRow {
    id: string
    name: string | null
    email: string
    role: "ADMIN" | "MENTOR" | "MENTEE"
    isActive: boolean
    createdAt: string
}

const ROLE_STYLES: Record<UserRow["role"], string> = {
    ADMIN: "bg-[#FDECEA] text-[#B71C1C]",
    MENTOR: "bg-[#EFEAFF] text-[#6C4FE0]",
    MENTEE: "bg-[#E6F7EE] text-[#1BA766]",
}

export function UsersRolesTable({
    users,
    currentUserId,
}: {
    users: UserRow[]
    currentUserId: string
}) {
    const [search, setSearch] = useState("")
    const [pendingId, setPendingId] = useState<string | null>(null)
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<
        string | null
    >(null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return users
        return users.filter((user) =>
            [user.name, user.email, user.role]
                .filter(Boolean)
                .some((field) => field!.toLowerCase().includes(query))
        )
    }, [users, search])

    function handleRoleChange(id: string, role: UserRow["role"]) {
        setError(null)
        setPendingId(id)
        startTransition(async () => {
            const result = await updateUserRoleAction(id, role)
            if (result?.error) setError(result.error)
            setPendingId(null)
        })
    }

    function handleToggleActive(id: string, isActive: boolean) {
        setError(null)
        setPendingId(id)
        startTransition(async () => {
            const result = await setUserActiveAction(id, isActive)
            if (result?.error) setError(result.error)
            setPendingId(null)
        })
    }

    function handleDelete(id: string) {
        if (confirmingDeleteId !== id) {
            setConfirmingDeleteId(id)
            return
        }
        setError(null)
        setPendingId(id)
        startTransition(async () => {
            const result = await deleteUserAction(id)
            if (result?.error) setError(result.error)
            setPendingId(null)
            setConfirmingDeleteId(null)
        })
    }

    return (
        <div>
            <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#171139]">
                        Users &amp; Roles
                    </h1>
                    <p className="text-sm text-[#6B6690] mt-1">
                        {users.length} user{users.length === 1 ? "" : "s"} on
                        the platform.
                    </p>
                </div>

                <div className="relative">
                    <SearchIcon className="w-4 h-4 text-[#9C97BE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2.5 rounded-full border border-[#E5E3F1] bg-white text-sm text-[#171139] placeholder-[#9C97BE] focus:outline-none focus:border-[#6C4FE0] w-64"
                    />
                </div>
            </div>

            {error && (
                <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                </p>
            )}

            <div className="bg-white rounded-2xl border border-[#EDEBF6] overflow-hidden overflow-x-auto">
                {filtered.length === 0 ? (
                    <div className="px-6 py-16 text-center text-sm text-[#6B6690]">
                        No users match your search.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#EDEBF6]">
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    User
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Role
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Joined
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold text-[#6B6690] uppercase tracking-wide">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => {
                                const rowBusy =
                                    isPending && pendingId === user.id
                                const isSelf = user.id === currentUserId
                                return (
                                    <tr
                                        key={user.id}
                                        className="border-b border-[#EDEBF6] last:border-0 hover:bg-[#F6F7FB] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-full bg-[#EFEAFF] text-[#6C4FE0] flex items-center justify-center font-bold text-sm shrink-0">
                                                    {(user.name ??
                                                        user.email)[0]?.toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-[#171139] truncate">
                                                        {user.name ??
                                                            "Unnamed"}
                                                        {isSelf && (
                                                            <span className="text-xs text-[#9C97BE] font-normal">
                                                                {" "}
                                                                (you)
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-[#6B6690] truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                disabled={rowBusy || isSelf}
                                                onChange={(e) =>
                                                    handleRoleChange(
                                                        user.id,
                                                        e.target
                                                            .value as UserRow["role"]
                                                    )
                                                }
                                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#6C4FE0]/40 disabled:opacity-60 ${ROLE_STYLES[user.role]}`}
                                            >
                                                <option value="ADMIN">
                                                    ADMIN
                                                </option>
                                                <option value="MENTOR">
                                                    MENTOR
                                                </option>
                                                <option value="MENTEE">
                                                    MENTEE
                                                </option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    handleToggleActive(
                                                        user.id,
                                                        !user.isActive
                                                    )
                                                }
                                                disabled={rowBusy || isSelf}
                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full disabled:opacity-60 ${
                                                    user.isActive
                                                        ? "bg-[#E6F7EE] text-[#1BA766]"
                                                        : "bg-[#F1F0FA] text-[#6B6690]"
                                                }`}
                                            >
                                                {user.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#6B6690]">
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {!isSelf && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                    onBlur={() =>
                                                        setConfirmingDeleteId(
                                                            null
                                                        )
                                                    }
                                                    disabled={rowBusy}
                                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-60 ${
                                                        confirmingDeleteId ===
                                                        user.id
                                                            ? "bg-red-600 text-white"
                                                            : "border border-red-200 text-red-600 hover:bg-red-50"
                                                    }`}
                                                >
                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                    {confirmingDeleteId ===
                                                    user.id
                                                        ? "Confirm"
                                                        : "Delete"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
