import type { User as PrismaUser } from '@prisma/client';
import { prisma } from '../../../infrastructure/prisma.js';
import type { User, UserRepository } from '../domain/auth.js';

const mapUser = (user: PrismaUser): User => ({ id: user.id, username: user.username, passwordHash: user.passwordHash });

export class PrismaUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { username } });
    return user ? mapUser(user) : null;
  }

  async create(input: { username: string; passwordHash: string }): Promise<User> {
    return mapUser(await prisma.user.create({ data: input }));
  }
}
