import type { PasswordHasher, TokenService, User, UserRepository } from '../../src/modules/auth/domain/auth.js';

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  passwordHash: 'hashed-password',
  ...overrides,
});

export const makeAuthRepository = (overrides: Partial<UserRepository> = {}): UserRepository => ({
  findByEmail: async () => null,
  findById: async () => null,
  create: async (input) => makeUser(input),
  ...overrides,
});

export const fakePasswordHasher: PasswordHasher = {
  hash: async (value) => `hashed:${value}`,
  compare: async (value, hash) => hash === `hashed:${value}`,
};

export const fakeTokenService: TokenService = {
  sign: (userId) => `token:${userId}`,
  verify: (token) => token.replace('token:', ''),
};
