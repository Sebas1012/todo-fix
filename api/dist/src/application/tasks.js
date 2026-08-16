import { AppError, notFound } from '../shared/errors.js';
export class CreateTask {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(userId, input) {
        const title = input.title.trim();
        if (!title)
            throw new AppError(400, 'Task title cannot be empty');
        return this.repository.create(userId, { title, category: input.category, priority: input.priority, completed: input.completed });
    }
}
export class ListTasks {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    execute(userId, input) {
        const skip = (input.page - 1) * input.limit;
        return this.repository.findMany(userId, { completed: input.completed, skip, take: input.limit }).then((result) => ({
            items: result.items,
            pagination: { page: input.page, limit: input.limit, total: result.total, totalPages: Math.ceil(result.total / input.limit) },
        }));
    }
}
export class GetTask {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(userId, id) {
        const task = await this.repository.findById(userId, id);
        if (!task)
            throw notFound('Task');
        return task;
    }
}
export class UpdateTask {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(userId, id, input) {
        const update = { ...input, ...(input.title !== undefined ? { title: input.title.trim() } : {}) };
        if (update.title !== undefined && !update.title)
            throw new AppError(400, 'Task title cannot be empty');
        const task = await this.repository.update(userId, id, update);
        if (!task)
            throw notFound('Task');
        return task;
    }
}
export class DeleteTask {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(userId, id) {
        if (!(await this.repository.delete(userId, id)))
            throw notFound('Task');
    }
}
