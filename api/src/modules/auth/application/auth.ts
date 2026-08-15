import { AppError } from '../../../shared/errors.js';
import type { PasswordHasher, TokenService, UserRepository } from '../domain/auth.js';

export class RegisterUser {
  constructor(private readonly users: UserRepository, private readonly passwords: PasswordHasher, private readonly tokens: TokenService) {}

  async execute(input: { username: string; password: string }) {
    if (await this.users.findByUsername(input.username)) throw new AppError(409, 'Username already exists');
    const user = await this.users.create({ username: input.username, passwordHash: await this.passwords.hash(input.password) });
    return { token: this.tokens.sign(user.id), user: { id: user.id, username: user.username } };
  }
}

export class LoginUser {
  constructor(private readonly users: UserRepository, private readonly passwords: PasswordHasher, private readonly tokens: TokenService) {}

  async execute(input: { username: string; password: string }) {
    const user = await this.users.findByUsername(input.username);
    if (!user || !(await this.passwords.compare(input.password, user.passwordHash))) throw new AppError(401, 'Invalid credentials');
    return { token: this.tokens.sign(user.id), user: { id: user.id, username: user.username } };
  }
}
