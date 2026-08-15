import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { apiReference } from '@scalar/express-api-reference';
import { env } from './config/env.js';
import { login, loginSchema, authenticate } from './auth.js';
import { PrismaTaskRepository } from './infrastructure/prisma-task-repository.js';
import { taskRouter, validationError } from './interfaces/http.js';
import { AppError } from './shared/errors.js';
import { openApiDocument } from '../openapi.js';

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: '10kb' }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/openapi.json', (_req, res) => res.json(openApiDocument));
  app.use('/docs', apiReference({ spec: { content: openApiDocument } }));
  app.post('/api/auth/login', (req, res, next) => {
    try {
      const credentials = loginSchema.parse(req.body);
      res.json({ data: { token: login(credentials.username, credentials.password) } });
    } catch (e) {
      next(e);
    }
  });
  app.use('/api/tasks', authenticate, taskRouter(new PrismaTaskRepository()));
  app.use((_req, _res, next) => next(new AppError(404, 'Route not found')));
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const normalized = validationError(error);
    const appError = normalized instanceof AppError ? normalized : null;
    const status = appError?.statusCode ?? 500;
    res.status(status).json({ error: { code: status === 500 ? 'INTERNAL_SERVER_ERROR' : `HTTP_${status}`, message: appError?.message ?? 'Internal server error', details: appError?.details } });
  });
  return app;
};
