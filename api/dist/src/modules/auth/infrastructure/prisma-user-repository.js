import { prisma } from '../../../infrastructure/prisma.js';
const mapUser = (user) => ({ id: user.id, fullName: user.fullName, email: user.email, passwordHash: user.passwordHash });
export class PrismaUserRepository {
    async findByEmail(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        return user ? mapUser(user) : null;
    }
    async findById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        return user ? mapUser(user) : null;
    }
    async create(input) {
        return mapUser(await prisma.user.create({ data: input }));
    }
}
