import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { z } from 'zod';
import { env } from './config/env.js';
import { AppError } from './shared/errors.js';

export const loginSchema = z.object({ username: z.string().min(1), password: z.string().min(1) }).strict();

export const login = (username: string, password: string) => {
  if (username !== env.AUTH_USERNAME || password !== env.AUTH_PASSWORD) throw new AppError(401, 'Invalid credentials');
  return jwt.sign({ sub: username }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const authenticate: RequestHandler = (req, _res, next) => {
  if (env.NODE_ENV === 'development' && env.DEV_AUTH_BYPASS) {
    next();
    return;
  }

  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) throw new AppError(401, 'Authentication required');
    jwt.verify(token, env.JWT_SECRET);
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, 'Invalid or expired token'));
  }
};
