import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { AuthController } from '../../../src/modules/auth/interfaces/controllers/auth.controller.js';

type TestResponse = Response & { body?: unknown; statusCode?: number; headers: Record<string, string> };

const response = (): TestResponse => {
  const res = {} as TestResponse;
  res.headers = {};
  res.status = vi.fn((status: number) => { res.statusCode = status; return res; }) as unknown as TestResponse['status'];
  res.json = vi.fn((body: unknown) => { res.body = body; return res; }) as unknown as TestResponse['json'];
  res.send = vi.fn(() => res) as unknown as TestResponse['send'];
  res.setHeader = vi.fn((name: string, value: string) => { res.headers[name] = value; return res; }) as unknown as TestResponse['setHeader'];
  return res;
};

describe('AuthController', () => {
  it('registers and sets the auth cookie without exposing the token', async () => {
    const res = response();
    const controller = new AuthController(
      { execute: vi.fn(async () => ({ token: 'secret-token', user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } })) } as never,
      {} as never,
      {} as never,
    );

    await controller.register({ body: { fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'password' } } as Request, res);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ data: { user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } } });
    expect(res.headers['Set-Cookie']).toContain('HttpOnly');
  });

  it('logs in and sets the auth cookie', async () => {
    const res = response();
    const controller = new AuthController(
      {} as never,
      { execute: vi.fn(async () => ({ token: 'secret-token', user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } })) } as never,
      {} as never,
    );

    await controller.login({ body: { email: 'ada@example.com', password: 'password' } } as Request, res);

    expect(res.body).toEqual({ data: { user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } } });
    expect(res.headers['Set-Cookie']).toContain('secret-token');
  });

  it('returns the current user and clears the cookie on logout', async () => {
    const res = response();
    const controller = new AuthController(
      {} as never,
      {} as never,
      { execute: vi.fn(async () => ({ id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' })) } as never,
    );

    await controller.me({ userId: 'user-1' } as Request, res);
    expect(res.body).toEqual({ data: { user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } } });

    await controller.logout({} as Request, res);
    expect(res.statusCode).toBe(204);
    expect(res.headers['Set-Cookie']).toContain('Max-Age=0');
  });
});
