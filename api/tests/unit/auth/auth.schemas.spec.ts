import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '../../../src/modules/auth/interfaces/schemas/auth.schemas.js';

describe('auth schemas', () => {
  it('normalizes registration fields', () => {
    expect(registerSchema.parse({ fullName: ' Ada ', email: ' ADA@EXAMPLE.COM ', password: 'password' })).toEqual({ fullName: 'Ada', email: 'ada@example.com', password: 'password' });
  });

  it('rejects short passwords and unknown fields', () => {
    expect(() => loginSchema.parse({ email: 'ada@example.com', password: 'short' })).toThrow();
    expect(() => loginSchema.parse({ email: 'ada@example.com', password: 'password', extra: true })).toThrow();
  });
});
