import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/errors.js';
export class JwtTokenService {
    sign(userId) { return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN }); }
    verify(token) {
        const payload = jwt.verify(token, env.JWT_SECRET);
        if (typeof payload === 'string' || typeof payload.sub !== 'string')
            throw new AppError(401, 'Invalid token subject');
        return payload.sub;
    }
}
