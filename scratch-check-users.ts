import { PrismaClient } from "./src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, mustResetPassword: true },
    })
    console.log(JSON.stringify(users, null, 2))
}

main().finally(() => prisma.$disconnect())
