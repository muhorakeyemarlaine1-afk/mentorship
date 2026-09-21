import { PrismaClient } from "./src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
    const password = await bcrypt.hash("Test1234!", 10)

    const mentee = await prisma.user.upsert({
        where: { email: "chat-test-mentee@example.com" },
        update: {},
        create: {
            email: "chat-test-mentee@example.com",
            password,
            name: "Chat Test Mentee",
            role: "MENTEE",
            mustResetPassword: false,
        },
    })

    const mentor = await prisma.user.upsert({
        where: { email: "chat-test-mentor@example.com" },
        update: {},
        create: {
            email: "chat-test-mentor@example.com",
            password,
            name: "Chat Test Mentor",
            role: "MENTOR",
            mustResetPassword: false,
        },
    })

    console.log(JSON.stringify({ mentee, mentor }, null, 2))
}

main().finally(() => prisma.$disconnect())
