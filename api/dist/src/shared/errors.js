export class AppError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
    }
}
export const notFound = (resource) => new AppError(404, `${resource} not found`);
