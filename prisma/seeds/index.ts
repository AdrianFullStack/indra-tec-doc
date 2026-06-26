import seedUsers from "./0_users";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = `postgres://${process.env["DB_USERNAME"]}:${process.env["DB_PASSWORD"]}@${process.env["DB_HOST"]}:${process.env["DB_PORT"]}/${process.env["DB_NAME"]}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const start = new Date();
    console.log("Seeding database...");

    await seedUsers(prisma);

    const end = new Date();
    console.log(`Seeding completed: ${end.getTime() - start.getTime()}ms`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });