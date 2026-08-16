import { describe, expect, it, vi } from 'vitest';
import { authenticate } from '../../../src/interfaces/http/middleware/authenticate.js';
const requestWithCookie = (cookie) => ({ headers: cookie ? { cookie } : {} });
describe('authenticate middleware', () => {
    it('rejects requests without an auth cookie', () => {
        const next = vi.fn();
        authenticate({ sign: () => '', verify: () => 'user-1' })(requestWithCookie(), {}, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });
    it('assigns the verified subject to req.userId', () => {
        const next = vi.fn();
        const request = requestWithCookie('iris_auth=valid-token');
        authenticate({ sign: () => '', verify: (token) => { expect(token).toBe('valid-token'); return 'user-1'; } })(request, {}, next);
        expect(request.userId).toBe('user-1');
        expect(next).toHaveBeenCalledWith();
    });
    it('converts token verification errors to 401', () => {
        const next = vi.fn();
        authenticate({ sign: () => '', verify: () => { throw new Error('bad token'); } })(requestWithCookie('iris_auth=invalid'), {}, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });
});
