import type { User as PrismaUser } from '@prisma/client';
import { prisma } from '../../../infrastructure/prisma.js';
import type { User, UserRepository } from '../domain/auth.js';

const mapUser = (user: PrismaUser): User => ({ id: user.id, fullName: user.fullName, email: user.email, passwordHash: user.passwordHash });

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? mapUser(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? mapUser(user) : null;
  }

  async create(input: { fullName: string; email: string; passwordHash: string }): Promise<User> {
    return mapUser(await prisma.user.create({ data: input }));
  }
}
