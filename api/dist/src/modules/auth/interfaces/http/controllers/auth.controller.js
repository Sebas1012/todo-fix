import { credentialsSchema } from '../schemas/auth.schemas.js';
export class AuthController {
    registerUser;
    loginUser;
    constructor(registerUser, loginUser) {
        this.registerUser = registerUser;
        this.loginUser = loginUser;
    }
    register = async (req, res) => {
        const credentials = credentialsSchema.parse(req.body);
        res.status(201).json({ data: await this.registerUser.execute(credentials) });
    };
    login = async (req, res) => {
        const credentials = credentialsSchema.parse(req.body);
        res.json({ data: await this.loginUser.execute(credentials) });
    };
}
