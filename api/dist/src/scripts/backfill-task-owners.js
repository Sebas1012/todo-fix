import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { prisma } from '../infrastructure/prisma.js';
const run = async () => {
    const passwordHash = await bcrypt.hash(env.AUTH_PASSWORD, 12);
    const user = await prisma.user.upsert({
        where: { username: env.AUTH_USERNAME },
        update: {},
        create: { username: env.AUTH_USERNAME, passwordHash },
    });
    const result = await prisma.$runCommandRaw({
        update: 'tasks',
        updates: [{
                q: { userId: { $exists: false } },
                u: [{ $set: { userId: { $toObjectId: user.id } } }],
                multi: true,
            }],
    });
    console.log(`Assigned existing tasks to ${user.username}.`, result);
};
run().finally(() => prisma.$disconnect());
