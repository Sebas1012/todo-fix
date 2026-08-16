import { AppError } from '../../../shared/errors.js';
import { readAuthCookie } from '../../../modules/auth/interfaces/cookie.js';
export const authenticate = (tokens) => (req, _res, next) => {
    try {
        const token = readAuthCookie(req);
        if (!token)
            throw new AppError(401, 'Authentication required');
        req.userId = tokens.verify(token);
        next();
    }
    catch (error) {
        next(error instanceof AppError ? error : new AppError(401, 'Invalid or expired token'));
    }
};
