import bcrypt from 'bcryptjs';
import type { PasswordHasher } from '../domain/auth.js';

export class BcryptPasswordHasher implements PasswordHasher {
  hash(value: string): Promise<string> { return bcrypt.hash(value, 12); }
  compare(value: string, hash: string): Promise<boolean> { return bcrypt.compare(value, hash); }
}
