import { AppError } from '../../../../shared/errors.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';
import { clearAuthCookie, setAuthCookie } from '../cookie.js';
export class AuthController {
    registerUser;
    loginUser;
    getCurrentUser;
    constructor(registerUser, loginUser, getCurrentUser) {
        this.registerUser = registerUser;
        this.loginUser = loginUser;
        this.getCurrentUser = getCurrentUser;
    }
    register = async (req, res) => {
        const credentials = registerSchema.parse(req.body);
        const result = await this.registerUser.execute(credentials);
        setAuthCookie(res, result.token);
        res.status(201).json({ data: { user: result.user } });
    };
    login = async (req, res) => {
        const credentials = loginSchema.parse(req.body);
        const result = await this.loginUser.execute(credentials);
        setAuthCookie(res, result.token);
        res.json({ data: { user: result.user } });
    };
    me = async (req, res) => {
        if (!req.userId)
            throw new AppError(401, 'Authentication required');
        res.json({ data: { user: await this.getCurrentUser.execute(req.userId) } });
    };
    logout = async (_req, res) => {
        clearAuthCookie(res);
        res.status(204).send();
    };
}
