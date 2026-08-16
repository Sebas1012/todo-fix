import { prisma } from './prisma.js';
const categories = new Set(['FrontEnd', 'BackEnd', 'Docs']);
const priorities = new Set(['Baja', 'Media', 'Urgente']);
const mapCategory = (value) => typeof value === 'string' && categories.has(value) ? value : 'FrontEnd';
const mapPriority = (value) => typeof value === 'string' && priorities.has(value) ? value : 'Media';
const mapTask = (task) => ({ ...task, category: mapCategory(task.category), priority: mapPriority(task.priority) });
export class PrismaTaskRepository {
    async create(userId, input) {
        return mapTask(await prisma.task.create({ data: { userId, title: input.title, category: input.category, priority: input.priority, completed: input.completed ?? false } }));
    }
    async findMany(userId, input) {
        const where = { userId, ...(input.completed === undefined ? {} : { completed: input.completed }) };
        const [items, total] = await Promise.all([
            prisma.task.findMany({ where, skip: input.skip, take: input.take, orderBy: { createdAt: 'desc' } }),
            prisma.task.count({ where }),
        ]);
        return { items: items.map(mapTask), total };
    }
    async findById(userId, id) {
        const task = await prisma.task.findFirst({ where: { id, userId } });
        return task ? mapTask(task) : null;
    }
    async update(userId, id, input) {
        try {
            const task = await prisma.task.findFirst({ where: { id, userId } });
            return task ? mapTask(await prisma.task.update({ where: { id }, data: input })) : null;
        }
        catch (error) {
            if (error instanceof Error && error.name === 'PrismaClientKnownRequestError')
                return null;
            throw error;
        }
    }
    async delete(userId, id) {
        try {
            const task = await prisma.task.findFirst({ where: { id, userId } });
            if (!task)
                return false;
            await prisma.task.delete({ where: { id } });
            return true;
        }
        catch (error) {
            if (error instanceof Error && error.name === 'PrismaClientKnownRequestError')
                return false;
            throw error;
        }
    }
}
