import { z } from 'zod';
import { AppError } from '../errors.js';
export const validationError = (error) => error instanceof z.ZodError ? new AppError(400, 'Validation failed', error.flatten()) : error;
