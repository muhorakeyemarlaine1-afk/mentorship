import { prisma } from "@/lib/prisma"
import { MentorsBrowser } from "@/components/MentorsBrowser"

export const dynamic = "force-dynamic"

export default async function OurMentorsPage() {
    const mentors = await prisma.user.findMany({
        where: { role: "MENTOR" },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            title: true,
            bio: true,
            image: true,
            isActive: true,
        },
    })

    return (
        <MentorsBrowser
            mentors={mentors.map((m) => ({
                id: m.id,
                name: m.name ?? m.email,
                title: m.title,
                bio: m.bio,
                image: m.image,
                available: m.isActive,
            }))}
        />
    )
}
