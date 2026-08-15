export type User = {
  id: string;
  username: string;
  passwordHash: string;
};

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(input: { username: string; passwordHash: string }): Promise<User>;
}

export interface PasswordHasher {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}

export interface TokenService {
  sign(userId: string): string;
  verify(token: string): string;
}
