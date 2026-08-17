const LOGO_URL =
    "https://globalyouthemerge.org/wp-content/uploads/2025/05/Logo-global-youth.png"

export function Footer() {
    return (
        <footer className="bg-[#0D1F3C] text-white py-8">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <img
                        src={LOGO_URL}
                        alt="Global Youth Emerge"
                        className="h-8 w-auto brightness-0 invert"
                    />
                    <span
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        className="text-[#6B84A3] text-sm"
                    >
                        © 2025 Global Youth Emerge ·
                        mentorship.globalyouthemerge.org
                    </span>
                </div>
                <div className="flex gap-5">
                    {["Privacy", "Terms", "Contact"].map((l) => (
                        <a
                            key={l}
                            href="#"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="text-[#6B84A3] text-xs hover:text-white transition-colors"
                        >
                            {l}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
