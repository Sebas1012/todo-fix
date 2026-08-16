import { Router } from 'express';
import { z } from 'zod';
export const credentialsSchema = z.object({ username: z.string().trim().min(3).max(50), password: z.string().min(8).max(128) }).strict();
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
export const authRouter = (register, login) => {
    const router = Router();
    router.post('/register', asyncHandler(async (req, res) => {
        const credentials = credentialsSchema.parse(req.body);
        res.status(201).json({ data: await register.execute(credentials) });
    }));
    router.post('/login', asyncHandler(async (req, res) => {
        const credentials = credentialsSchema.parse(req.body);
        res.json({ data: await login.execute(credentials) });
    }));
    return router;
};
