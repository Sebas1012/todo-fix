import { describe, expect, it, vi } from 'vitest';
import { AuthController } from '../../../src/modules/auth/interfaces/controllers/auth.controller.js';
const response = () => {
    const res = {};
    res.headers = {};
    res.status = vi.fn((status) => { res.statusCode = status; return res; });
    res.json = vi.fn((body) => { res.body = body; return res; });
    res.send = vi.fn(() => res);
    res.setHeader = vi.fn((name, value) => { res.headers[name] = value; return res; });
    return res;
};
describe('AuthController', () => {
    it('registers and sets the auth cookie without exposing the token', async () => {
        const res = response();
        const controller = new AuthController({ execute: vi.fn(async () => ({ token: 'secret-token', user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } })) }, {}, {});
        await controller.register({ body: { fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'password' } }, res);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ data: { user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } } });
        expect(res.headers['Set-Cookie']).toContain('HttpOnly');
    });
    it('logs in and sets the auth cookie', async () => {
        const res = response();
        const controller = new AuthController({}, { execute: vi.fn(async () => ({ token: 'secret-token', user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } })) }, {});
        await controller.login({ body: { email: 'ada@example.com', password: 'password' } }, res);
        expect(res.body).toEqual({ data: { user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } } });
        expect(res.headers['Set-Cookie']).toContain('secret-token');
    });
    it('returns the current user and clears the cookie on logout', async () => {
        const res = response();
        const controller = new AuthController({}, {}, { execute: vi.fn(async () => ({ id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' })) });
        await controller.me({ userId: 'user-1' }, res);
        expect(res.body).toEqual({ data: { user: { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' } } });
        await controller.logout({}, res);
        expect(res.statusCode).toBe(204);
        expect(res.headers['Set-Cookie']).toContain('Max-Age=0');
    });
});
