export type User = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
};

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(input: { fullName: string; email: string; passwordHash: string }): Promise<User>;
}

export interface PasswordHasher {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}

export interface TokenService {
  sign(userId: string): string;
  verify(token: string): string;
}
