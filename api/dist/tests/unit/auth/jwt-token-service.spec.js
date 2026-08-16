import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';
import { JwtTokenService } from '../../../src/modules/auth/infrastructure/jwt-token-service.js';
import { env } from '../../../src/config/env.js';
describe('JwtTokenService', () => {
    const service = new JwtTokenService();
    it('signs and verifies a user id', () => {
        const token = service.sign('user-1');
        expect(service.verify(token)).toBe('user-1');
    });
    it('rejects a token signed with another secret', () => {
        const token = jwt.sign({ sub: 'user-1' }, 'another-secret');
        expect(() => service.verify(token)).toThrow();
    });
    it('rejects a token without a string subject', () => {
        const token = jwt.sign({ role: 'user' }, env.JWT_SECRET);
        try {
            service.verify(token);
            throw new Error('Expected token verification to fail');
        }
        catch (error) {
            expect(error).toMatchObject({ statusCode: 401 });
        }
    });
});
