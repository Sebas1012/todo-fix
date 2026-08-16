import { describe, expect, it, vi } from 'vitest';
import { GetCurrentUser, LoginUser, RegisterUser } from '../../../src/modules/auth/application/auth.js';
import { makeAuthRepository, makeUser, fakePasswordHasher, fakeTokenService } from '../../helpers/auth-fakes.js';

describe('auth application', () => {
  it('registers a new user and returns a signed token', async () => {
    const repository = makeAuthRepository();
    const result = await new RegisterUser(repository, fakePasswordHasher, fakeTokenService).execute({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'password' });

    expect(result).toEqual({ token: 'token:user-1', user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } });
  });

  it('rejects duplicate emails before creating a user', async () => {
    const create = vi.fn();
    const repository = makeAuthRepository({ findByEmail: async () => makeUser(), create });

    await expect(new RegisterUser(repository, fakePasswordHasher, fakeTokenService).execute({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'password' })).rejects.toMatchObject({ statusCode: 409 });
    expect(create).not.toHaveBeenCalled();
  });

  it('logs in with valid credentials', async () => {
    const repository = makeAuthRepository({ findByEmail: async () => makeUser({ passwordHash: 'hashed:password' }) });

    await expect(new LoginUser(repository, fakePasswordHasher, fakeTokenService).execute({ email: 'ada@example.com', password: 'password' })).resolves.toMatchObject({ token: 'token:user-1' });
  });

  it('rejects unknown users and invalid passwords', async () => {
    const missing = makeAuthRepository();
    await expect(new LoginUser(missing, fakePasswordHasher, fakeTokenService).execute({ email: 'missing@example.com', password: 'password' })).rejects.toMatchObject({ statusCode: 401 });

    const invalid = makeAuthRepository({ findByEmail: async () => makeUser({ passwordHash: 'hashed:other' }) });
    await expect(new LoginUser(invalid, fakePasswordHasher, fakeTokenService).execute({ email: 'ada@example.com', password: 'password' })).rejects.toMatchObject({ statusCode: 401 });
  });

  it('returns the current user by id', async () => {
    const repository = makeAuthRepository({ findById: async (id) => makeUser({ id }) });
    await expect(new GetCurrentUser(repository).execute('user-9')).resolves.toEqual({ id: 'user-9', fullName: 'Ada Lovelace', email: 'ada@example.com' });
  });

  it('rejects a session for a deleted user', async () => {
    await expect(new GetCurrentUser(makeAuthRepository()).execute('deleted-user')).rejects.toMatchObject({ statusCode: 401 });
  });
});
