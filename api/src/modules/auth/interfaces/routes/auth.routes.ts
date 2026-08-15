import { Router, type RequestHandler } from 'express';
import { asyncHandler } from '../../../../interfaces/http/async-handler.js';
import type { AuthController } from '../controllers/auth.controller.js';

export const authRouter = (controller: AuthController, authenticate: RequestHandler) => {
  const router = Router();
  router.post('/register', asyncHandler(controller.register));
  router.post('/login', asyncHandler(controller.login));
  router.get('/me', authenticate, asyncHandler(controller.me));
  router.post('/logout', asyncHandler(controller.logout));
  return router;
};
