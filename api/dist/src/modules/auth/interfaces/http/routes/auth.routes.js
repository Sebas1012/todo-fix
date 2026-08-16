import { Router } from 'express';
import { asyncHandler } from '../../../../../interfaces/http/async-handler.js';
export const authRouter = (controller) => {
    const router = Router();
    router.post('/register', asyncHandler(controller.register));
    router.post('/login', asyncHandler(controller.login));
    return router;
};
