import type { Request, Response } from 'express';
import { AppError } from '../../../../shared/errors.js';
import { GetCurrentUser, LoginUser, RegisterUser } from '../../application/auth.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';
import { clearAuthCookie, setAuthCookie } from '../cookie.js';

export class AuthController {
  constructor(private readonly registerUser: RegisterUser, private readonly loginUser: LoginUser, private readonly getCurrentUser: GetCurrentUser) {}

  readonly register = async (req: Request, res: Response): Promise<void> => {
    const credentials = registerSchema.parse(req.body);
    const result = await this.registerUser.execute(credentials);
    setAuthCookie(res, result.token);
    res.status(201).json({ data: { user: result.user } });
  };

  readonly login = async (req: Request, res: Response): Promise<void> => {
    const credentials = loginSchema.parse(req.body);
    const result = await this.loginUser.execute(credentials);
    setAuthCookie(res, result.token);
    res.json({ data: { user: result.user } });
  };

  readonly me = async (req: Request, res: Response): Promise<void> => {
    if (!req.userId) throw new AppError(401, 'Authentication required');
    res.json({ data: { user: await this.getCurrentUser.execute(req.userId) } });
  };

  readonly logout = async (_req: Request, res: Response): Promise<void> => {
    clearAuthCookie(res);
    res.status(204).send();
  };
}
