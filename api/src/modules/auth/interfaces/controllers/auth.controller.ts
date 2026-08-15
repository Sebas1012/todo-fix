import type { Request, Response } from 'express';
import { LoginUser, RegisterUser } from '../../application/auth.js';
import { credentialsSchema } from '../schemas/auth.schemas.js';

export class AuthController {
  constructor(private readonly registerUser: RegisterUser, private readonly loginUser: LoginUser) {}

  readonly register = async (req: Request, res: Response): Promise<void> => {
    const credentials = credentialsSchema.parse(req.body);
    res.status(201).json({ data: await this.registerUser.execute(credentials) });
  };

  readonly login = async (req: Request, res: Response): Promise<void> => {
    const credentials = credentialsSchema.parse(req.body);
    res.json({ data: await this.loginUser.execute(credentials) });
  };
}
