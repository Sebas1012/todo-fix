import { AppError } from '../../../shared/errors.js';
export class RegisterUser {
    users;
    passwords;
    tokens;
    constructor(users, passwords, tokens) {
        this.users = users;
        this.passwords = passwords;
        this.tokens = tokens;
    }
    async execute(input) {
        if (await this.users.findByEmail(input.email))
            throw new AppError(409, 'Correo ya existente, no se puede registrar el usuario');
        const user = await this.users.create({ fullName: input.fullName, email: input.email, passwordHash: await this.passwords.hash(input.password) });
        return { token: this.tokens.sign(user.id), user: { id: user.id, fullName: user.fullName, email: user.email } };
    }
}
export class LoginUser {
    users;
    passwords;
    tokens;
    constructor(users, passwords, tokens) {
        this.users = users;
        this.passwords = passwords;
        this.tokens = tokens;
    }
    async execute(input) {
        const user = await this.users.findByEmail(input.email);
        if (!user || !(await this.passwords.compare(input.password, user.passwordHash)))
            throw new AppError(401, 'Invalid credentials');
        return { token: this.tokens.sign(user.id), user: { id: user.id, fullName: user.fullName, email: user.email } };
    }
}
export class GetCurrentUser {
    users;
    constructor(users) {
        this.users = users;
    }
    async execute(id) {
        const user = await this.users.findById(id);
        if (!user)
            throw new AppError(401, 'User session is invalid');
        return { id: user.id, fullName: user.fullName, email: user.email };
    }
}
