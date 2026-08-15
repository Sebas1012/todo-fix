import { z } from 'zod';
import { AppError } from '../../../shared/errors.js';

export const validationError = (error: unknown) => error instanceof z.ZodError ? new AppError(400, 'Validation failed', error.flatten()) : error;
