import { Router } from 'express';
import { asyncHandler } from '../../../../interfaces/http/async-handler.js';
export const taskRouter = (controller) => {
    const router = Router();
    router.get('/', asyncHandler(controller.list));
    router.post('/', asyncHandler(controller.create));
    router.get('/:id', asyncHandler(controller.get));
    router.patch('/:id', asyncHandler(controller.update));
    router.delete('/:id', asyncHandler(controller.remove));
    return router;
};
