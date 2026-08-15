import type { RequestHandler } from 'express';
import { AppError } from '../../../shared/errors.js';
import type { TokenService } from '../../../modules/auth/domain/auth.js';
import { readAuthCookie } from '../../../modules/auth/interfaces/cookie.js';

declare global {
  namespace Express { interface Request { userId?: string; } }
}

export const authenticate = (tokens: TokenService): RequestHandler => (req, _res, next) => {
  try {
    const token = readAuthCookie(req);
    if (!token) throw new AppError(401, 'Authentication required');
    req.userId = tokens.verify(token);
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, 'Invalid or expired token'));
  }
};
