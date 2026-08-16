import jwt from 'jsonwebtoken';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { env } from './config/env.js';
import { AppError } from './shared/errors.js';
import { prisma } from './infrastructure/prisma.js';
export const credentialsSchema = z.object({ username: z.string().trim().min(3).max(50), password: z.string().min(8).max(128) }).strict();
export const loginSchema = credentialsSchema;
export const registerSchema = credentialsSchema;
const createToken = (userId) => jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
export const register = async (username, password) => {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing)
        throw new AppError(409, 'Username already exists');
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { username, passwordHash } });
    return { token: createToken(user.id), user: { id: user.id, username: user.username } };
};
export const login = async (username, password) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        throw new AppError(401, 'Invalid credentials');
    return { token: createToken(user.id), user: { id: user.id, username: user.username } };
};
let devUserPromise;
const ensureDevUser = () => devUserPromise ??= (async () => {
    const passwordHash = await bcrypt.hash(env.AUTH_PASSWORD, 12);
    const user = await prisma.user.upsert({
        where: { username: env.AUTH_USERNAME },
        update: {},
        create: { username: env.AUTH_USERNAME, passwordHash },
    });
    return user.id;
})();
export const authenticate = (req, _res, next) => {
    if (env.NODE_ENV === 'development' && env.DEV_AUTH_BYPASS) {
        ensureDevUser().then((userId) => { req.userId = userId; next(); }).catch(next);
        return;
    }
    try {
        const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
        if (!token)
            throw new AppError(401, 'Authentication required');
        const payload = jwt.verify(token, env.JWT_SECRET);
        if (typeof payload === 'string' || typeof payload.sub !== 'string')
            throw new AppError(401, 'Invalid token subject');
        req.userId = payload.sub;
        next();
    }
    catch (error) {
        next(error instanceof AppError ? error : new AppError(401, 'Invalid or expired token'));
    }
};
