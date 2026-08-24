import { CSSProperties } from "react"

type IconProps = {
    className?: string
    style?: CSSProperties
}

const base = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
}

export function HomeIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z" />
        </svg>
    )
}

export function UsersIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
    )
}

export function UserIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}

export function SparkleIcon({ className, style }: IconProps) {
    return (
        <svg {...base} fill="currentColor" stroke="none" viewBox="0 0 24 24" className={className} style={style}>
            <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L6 9l5.2-1.8z" />
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
        </svg>
    )
}

export function CalendarIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <rect x="3" y="4.5" width="18" height="16" rx="2" />
            <path d="M16 2.5v4M8 2.5v4M3 10h18" />
        </svg>
    )
}

export function ChatIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M21 11.5a8.38 8.38 0 01-4.5 7.5 8.5 8.5 0 01-8.06.2L3 21l1.9-4.5A8.38 8.38 0 013 11.5 8.5 8.5 0 0111.5 3h.5a8.5 8.5 0 019 8.5z" />
        </svg>
    )
}

export function BookOpenIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M2 4h5a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
            <path d="M22 4h-5a4 4 0 00-4 4v14a3 3 0 013-3h6z" />
        </svg>
    )
}

export function BarChartIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
    )
}

export function BellIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
    )
}

export function SettingsIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
    )
}

export function ShieldIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M12 2l8 3.5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6z" />
        </svg>
    )
}

export function CreditCardIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
        </svg>
    )
}

export function FileTextIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h6M9 17h6" />
        </svg>
    )
}

export function SearchIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
        </svg>
    )
}

export function PlusIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M12 5v14M5 12h14" />
        </svg>
    )
}

export function ChevronDownIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M6 9l6 6 6-6" />
        </svg>
    )
}

export function PhoneIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
        </svg>
    )
}

export function VideoIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <rect x="1" y="5" width="15" height="14" rx="2" />
            <path d="M22 7l-6 5 6 5V7z" />
        </svg>
    )
}

export function MoreVerticalIcon({ className, style }: IconProps) {
    return (
        <svg {...base} fill="currentColor" stroke="none" viewBox="0 0 24 24" className={className} style={style}>
            <circle cx="12" cy="5" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="12" cy="19" r="1.8" />
        </svg>
    )
}

export function PaperclipIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </svg>
    )
}

export function SmileIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <path d="M9 9h.01M15 9h.01" />
        </svg>
    )
}

export function SendIcon({ className, style }: IconProps) {
    return (
        <svg {...base} fill="currentColor" stroke="none" viewBox="0 0 24 24" className={className} style={style}>
            <path d="M3 20l18-8L3 4l0 7 12 1-12 1z" />
        </svg>
    )
}

export function FilterIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M22 3H2l8 9.46V19l4 2v-8.54z" />
        </svg>
    )
}

export function UploadIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <path d="M17 8l-5-5-5 5" />
            <path d="M12 3v12" />
        </svg>
    )
}

export function ArchiveIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <rect x="2" y="3" width="20" height="5" rx="1" />
            <path d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8" />
            <path d="M10 12h4" />
        </svg>
    )
}

export function CheckCheckIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M2 12.5l4.5 4.5L18 5" />
            <path d="M8 12.5l4.5 4.5L24 5" />
        </svg>
    )
}

export function ArrowUpRightIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M7 17L17 7M7 7h10v10" />
        </svg>
    )
}

export function LogoutIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    )
}

export function XIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    )
}

export function EditIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" />
        </svg>
    )
}

export function TrashIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" />
            <path d="M10 11v6M14 11v6" />
        </svg>
    )
}

export function PowerIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M12 2v10" />
            <path d="M18.36 6.64a9 9 0 11-12.73 0" />
        </svg>
    )
}

export function ChevronLeftIcon({ className, style }: IconProps) {
    return (
        <svg {...base} className={className} style={style}>
            <path d="M15 18l-6-6 6-6" />
        </svg>
    )
}
