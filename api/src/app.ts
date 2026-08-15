import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { apiReference } from '@scalar/express-api-reference';
import { env } from './config/env.js';
import { LoginUser, RegisterUser } from './modules/auth/application/auth.js';
import { BcryptPasswordHasher } from './modules/auth/infrastructure/bcrypt-password-hasher.js';
import { PrismaUserRepository } from './modules/auth/infrastructure/prisma-user-repository.js';
import { JwtTokenService } from './modules/auth/infrastructure/jwt-token-service.js';
import { AuthController } from './modules/auth/interfaces/controllers/auth.controller.js';
import { authRouter } from './modules/auth/interfaces/routes/auth.routes.js';
import { authenticate } from './interfaces/http/middleware/authenticate.js';
import { PrismaTaskRepository } from './modules/tasks/infrastructure/prisma-task-repository.js';
import { CreateTask, DeleteTask, GetTask, ListTasks, UpdateTask } from './modules/tasks/application/tasks.js';
import { TaskController } from './modules/tasks/interfaces/controllers/task.controller.js';
import { taskRouter } from './modules/tasks/interfaces/routes/task.routes.js';
import { AppError } from './shared/errors.js';
import { validationError } from './interfaces/http/middleware/error-handler.js';
import { openApiDocument } from '../openapi.js';

export const createApp = () => {
  const app = express();
  const users = new PrismaUserRepository();
  const passwords = new BcryptPasswordHasher();
  const tokens = new JwtTokenService();
  const register = new RegisterUser(users, passwords, tokens);
  const login = new LoginUser(users, passwords, tokens);
  const authController = new AuthController(register, login);
  const ensureDevUser = async (): Promise<string> => {
    const existing = await users.findByUsername(env.AUTH_USERNAME);
    if (existing) return existing.id;
    const user = await users.create({ username: env.AUTH_USERNAME, passwordHash: await passwords.hash(env.AUTH_PASSWORD) });
    return user.id;
  };
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: '10kb' }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/openapi.json', (_req, res) => res.json(openApiDocument));
  app.use('/docs', apiReference({ spec: { content: openApiDocument } }));
  const taskRepository = new PrismaTaskRepository();
  const taskController = new TaskController(
    new CreateTask(taskRepository),
    new ListTasks(taskRepository),
    new GetTask(taskRepository),
    new UpdateTask(taskRepository),
    new DeleteTask(taskRepository),
  );
  app.use('/api/auth', authRouter(authController));
  app.use('/api/tasks', authenticate(tokens, ensureDevUser), taskRouter(taskController));
  app.use((_req, _res, next) => next(new AppError(404, 'Route not found')));
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const normalized = validationError(error);
    const appError = normalized instanceof AppError ? normalized : null;
    const status = appError?.statusCode ?? 500;
    res.status(status).json({ error: { code: status === 500 ? 'INTERNAL_SERVER_ERROR' : `HTTP_${status}`, message: appError?.message ?? 'Internal server error', details: appError?.details } });
  });
  return app;
};
