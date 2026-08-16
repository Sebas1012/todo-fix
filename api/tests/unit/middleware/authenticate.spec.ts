import type { Request, Response, NextFunction } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { authenticate } from '../../../src/interfaces/http/middleware/authenticate.js';

const requestWithCookie = (cookie?: string) => ({ headers: cookie ? { cookie } : {} }) as Request;

describe('authenticate middleware', () => {
  it('rejects requests without an auth cookie', () => {
    const next = vi.fn() as unknown as NextFunction;
    authenticate({ sign: () => '', verify: () => 'user-1' })(requestWithCookie(), {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('assigns the verified subject to req.userId', () => {
    const next = vi.fn() as unknown as NextFunction;
    const request = requestWithCookie('iris_auth=valid-token');
    authenticate({ sign: () => '', verify: (token) => { expect(token).toBe('valid-token'); return 'user-1'; } })(request, {} as Response, next);

    expect(request.userId).toBe('user-1');
    expect(next).toHaveBeenCalledWith();
  });

  it('converts token verification errors to 401', () => {
    const next = vi.fn() as unknown as NextFunction;
    authenticate({ sign: () => '', verify: () => { throw new Error('bad token'); } })(requestWithCookie('iris_auth=invalid'), {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });
});
