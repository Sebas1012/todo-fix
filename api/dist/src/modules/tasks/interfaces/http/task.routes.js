import { Router } from 'express';
import { z } from 'zod';
import { CreateTask, DeleteTask, GetTask, ListTasks, UpdateTask } from '../../application/tasks.js';
import { AppError } from '../../../../shared/errors.js';
import { presentTask } from './task-presenter.js';
const idSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid task id');
const categorySchema = z.enum(['FrontEnd', 'BackEnd', 'Docs']);
const prioritySchema = z.enum(['Baja', 'Media', 'Urgente']);
const createSchema = z.object({ title: z.string().min(1).max(200), category: categorySchema, priority: prioritySchema, completed: z.boolean().optional() }).strict();
const updateSchema = z.object({ title: z.string().min(1).max(200).optional(), category: categorySchema.optional(), priority: prioritySchema.optional(), completed: z.boolean().optional() }).strict().refine((v) => Object.keys(v).length > 0, 'At least one field is required');
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
export const taskRouter = (repository) => {
    const router = Router();
    const create = new CreateTask(repository);
    const list = new ListTasks(repository);
    const get = new GetTask(repository);
    const update = new UpdateTask(repository);
    const remove = new DeleteTask(repository);
    router.get('/', asyncHandler(async (req, res) => {
        if (!req.userId)
            throw new AppError(401, 'Authentication required');
        const query = z.object({ completed: z.enum(['true', 'false']).optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) }).parse(req.query);
        const result = await list.execute(req.userId, { completed: query.completed === undefined ? undefined : query.completed === 'true', page: query.page, limit: query.limit });
        res.json({ data: result.items.map(presentTask), pagination: result.pagination });
    }));
    router.post('/', asyncHandler(async (req, res) => {
        if (!req.userId)
            throw new AppError(401, 'Authentication required');
        const task = await create.execute(req.userId, createSchema.parse(req.body));
        res.status(201).json({ data: presentTask(task) });
    }));
    router.get('/:id', asyncHandler(async (req, res) => { if (!req.userId)
        throw new AppError(401, 'Authentication required'); res.json({ data: presentTask(await get.execute(req.userId, idSchema.parse(req.params.id))) }); }));
    router.patch('/:id', asyncHandler(async (req, res) => { if (!req.userId)
        throw new AppError(401, 'Authentication required'); res.json({ data: presentTask(await update.execute(req.userId, idSchema.parse(req.params.id), updateSchema.parse(req.body))) }); }));
    router.delete('/:id', asyncHandler(async (req, res) => { if (!req.userId)
        throw new AppError(401, 'Authentication required'); await remove.execute(req.userId, idSchema.parse(req.params.id)); res.status(204).send(); }));
    return router;
};
