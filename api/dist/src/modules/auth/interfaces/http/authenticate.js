import { env } from '../../../../config/env.js';
import { AppError } from '../../../../shared/errors.js';
export const authenticate = (tokens, ensureDevUser) => (req, _res, next) => {
    if (env.NODE_ENV === 'development' && env.DEV_AUTH_BYPASS) {
        ensureDevUser().then((userId) => { req.userId = userId; next(); }).catch(next);
        return;
    }
    try {
        const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
        if (!token)
            throw new AppError(401, 'Authentication required');
        req.userId = tokens.verify(token);
        next();
    }
    catch (error) {
        next(error instanceof AppError ? error : new AppError(401, 'Invalid or expired token'));
    }
};
