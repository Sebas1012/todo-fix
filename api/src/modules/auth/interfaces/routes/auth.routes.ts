import { Router } from 'express';
import { asyncHandler } from '../../../../interfaces/http/async-handler.js';
import type { AuthController } from '../controllers/auth.controller.js';

export const authRouter = (controller: AuthController) => {
  const router = Router();
  router.post('/register', asyncHandler(controller.register));
  router.post('/login', asyncHandler(controller.login));
  return router;
};
