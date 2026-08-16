export const makeUser = (overrides = {}) => ({
    id: 'user-1',
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    passwordHash: 'hashed-password',
    ...overrides,
});
export const makeAuthRepository = (overrides = {}) => ({
    findByEmail: async () => null,
    findById: async () => null,
    create: async (input) => makeUser(input),
    ...overrides,
});
export const fakePasswordHasher = {
    hash: async (value) => `hashed:${value}`,
    compare: async (value, hash) => hash === `hashed:${value}`,
};
export const fakeTokenService = {
    sign: (userId) => `token:${userId}`,
    verify: (token) => token.replace('token:', ''),
};
