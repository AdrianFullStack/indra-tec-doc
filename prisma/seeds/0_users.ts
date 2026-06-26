import { PrismaClient } from '@prisma/client/extension';
import * as bcrypt from 'bcrypt';

const email = "rasuclupe@example.com";
const SALT_ROUNDS = 12;
const DEMO_PASSWORD = 'Demo1234!';

const seedUsers = async (prisma: PrismaClient) => {
    const start = Date.now();
    console.log("Seeding users...");

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            name: 'Rogelio',
            lastname: 'Suclupe',
            password: passwordHash,
            email
        },
    });

    const end = Date.now();
    console.log(`Seeding users completed in ${end - start}ms`);

    return user;
};

export default seedUsers;