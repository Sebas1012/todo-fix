import { AppError } from '../../../shared/errors.js';
import type { PasswordHasher, TokenService, UserRepository } from '../domain/auth.js';

export class RegisterUser {
  constructor(private readonly users: UserRepository, private readonly passwords: PasswordHasher, private readonly tokens: TokenService) {}

  async execute(input: { fullName: string; email: string; password: string }) {
    if (await this.users.findByEmail(input.email)) throw new AppError(409, 'Correo ya existente, no se puede registrar el usuario');
    const user = await this.users.create({ fullName: input.fullName, email: input.email, passwordHash: await this.passwords.hash(input.password) });
    return { token: this.tokens.sign(user.id), user: { id: user.id, fullName: user.fullName, email: user.email } };
  }
}

export class LoginUser {
  constructor(private readonly users: UserRepository, private readonly passwords: PasswordHasher, private readonly tokens: TokenService) {}

  async execute(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(input.email);
    if (!user || !(await this.passwords.compare(input.password, user.passwordHash)))
      throw new AppError(401, 'Invalid credentials');
    return { token: this.tokens.sign(user.id), user: { id: user.id, fullName: user.fullName, email: user.email } };
  }
}

export class GetCurrentUser {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string) {
    const user = await this.users.findById(id);
    if (!user) throw new AppError(401, 'User session is invalid');
    return { id: user.id, fullName: user.fullName, email: user.email };
  }
}
