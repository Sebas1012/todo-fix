import { AppError } from '../../../../../shared/errors.js';
import { presentTask } from '../task-presenter.js';
import { createTaskSchema, idSchema, listTasksSchema, updateTaskSchema } from '../schemas/task.schemas.js';
export class TaskController {
    createTask;
    listTasks;
    getTask;
    updateTask;
    deleteTask;
    constructor(createTask, listTasks, getTask, updateTask, deleteTask) {
        this.createTask = createTask;
        this.listTasks = listTasks;
        this.getTask = getTask;
        this.updateTask = updateTask;
        this.deleteTask = deleteTask;
    }
    list = async (req, res) => {
        const query = listTasksSchema.parse(req.query);
        const result = await this.listTasks.execute(this.userId(req), { ...query, completed: query.completed === undefined ? undefined : query.completed === 'true' });
        res.json({ data: result.items.map(presentTask), pagination: result.pagination });
    };
    create = async (req, res) => {
        const task = await this.createTask.execute(this.userId(req), createTaskSchema.parse(req.body));
        res.status(201).json({ data: presentTask(task) });
    };
    get = async (req, res) => {
        res.json({ data: presentTask(await this.getTask.execute(this.userId(req), idSchema.parse(req.params.id))) });
    };
    update = async (req, res) => {
        const task = await this.updateTask.execute(this.userId(req), idSchema.parse(req.params.id), updateTaskSchema.parse(req.body));
        res.json({ data: presentTask(task) });
    };
    remove = async (req, res) => {
        await this.deleteTask.execute(this.userId(req), idSchema.parse(req.params.id));
        res.status(204).send();
    };
    userId(req) {
        if (!req.userId)
            throw new AppError(401, 'Authentication required');
        return req.userId;
    }
}
