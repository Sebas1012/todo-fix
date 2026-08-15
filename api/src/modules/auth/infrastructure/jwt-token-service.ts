import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/errors.js';
import type { TokenService } from '../domain/auth.js';

export class JwtTokenService implements TokenService {
  sign(userId: string): string { return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions); }

  verify(token: string): string {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === 'string' || typeof payload.sub !== 'string') throw new AppError(401, 'Invalid token subject');
    return payload.sub;
  }
}
