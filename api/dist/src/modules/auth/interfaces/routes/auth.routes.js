import { Router } from 'express';
import { asyncHandler } from '../../../../interfaces/http/async-handler.js';
export const authRouter = (controller, authenticate) => {
    const router = Router();
    router.post('/register', asyncHandler(controller.register));
    router.post('/login', asyncHandler(controller.login));
    router.get('/me', authenticate, asyncHandler(controller.me));
    router.post('/logout', asyncHandler(controller.logout));
    return router;
};
