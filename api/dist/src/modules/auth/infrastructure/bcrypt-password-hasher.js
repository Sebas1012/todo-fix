import bcrypt from 'bcryptjs';
export class BcryptPasswordHasher {
    hash(value) { return bcrypt.hash(value, 12); }
    compare(value, hash) { return bcrypt.compare(value, hash); }
}
