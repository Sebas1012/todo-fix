import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(16),
    JWT_EXPIRES_IN: z.string().default('15m'),
    CORS_ORIGIN: z.string().default('http://localhost:4200'),
});
export const env = schema.parse(process.env);
