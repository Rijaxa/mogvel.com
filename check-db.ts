import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Checking database connection...")

    try {
        const userCount = await prisma.user.count()
        console.log(`✅ Success! Database is connected.`)
        console.log(`Currently there are ${userCount} users in the system.`)

        const orgCount = await prisma.organization.count()
        console.log(`Currently there are ${orgCount} organizations.`)

    } catch (e) {
        console.error("❌ Failed to connect to database:", e)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
