import { describe, expect, it } from 'vitest';
import { clearAuthCookie, readAuthCookie, setAuthCookie } from '../../../src/modules/auth/interfaces/cookie.js';
describe('auth cookie', () => {
    it('reads the auth cookie among multiple cookies', () => {
        const request = { headers: { cookie: 'theme=dark; iris_auth=jwt-token; other=value' } };
        expect(readAuthCookie(request)).toBe('jwt-token');
    });
    it('returns null when the auth cookie is absent', () => {
        expect(readAuthCookie({ headers: {} })).toBeNull();
    });
    it('serializes an HttpOnly auth cookie', () => {
        let header = '';
        const response = { setHeader: (_name, value) => { header = value; } };
        setAuthCookie(response, 'jwt.token');
        expect(header).toContain('iris_auth=jwt.token');
        expect(header).toContain('HttpOnly');
    });
    it('clears the auth cookie', () => {
        let header = '';
        const response = { setHeader: (_name, value) => { header = value; } };
        clearAuthCookie(response);
        expect(header).toContain('Max-Age=0');
        expect(header).toContain('HttpOnly');
    });
});
