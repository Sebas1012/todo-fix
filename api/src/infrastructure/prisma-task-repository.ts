import type { Task as PrismaTask } from '@prisma/client';
import { prisma } from './prisma.js';
import type { Task, TaskCategory, TaskPriority, TaskRepository } from '../domain/tasks/task.js';

const categories = new Set<TaskCategory>(['FrontEnd', 'BackEnd', 'Docs']);
const priorities = new Set<TaskPriority>(['Baja', 'Media', 'Urgente']);

const mapCategory = (value: unknown): TaskCategory => typeof value === 'string' && categories.has(value as TaskCategory) ? value as TaskCategory : 'FrontEnd';
const mapPriority = (value: unknown): TaskPriority => typeof value === 'string' && priorities.has(value as TaskPriority) ? value as TaskPriority : 'Media';
const mapTask = (task: PrismaTask): Task => ({ ...task, category: mapCategory(task.category), priority: mapPriority(task.priority) });

export class PrismaTaskRepository implements TaskRepository {
  async create(input: { title: string; category: Task['category']; priority: Task['priority']; completed?: boolean }): Promise<Task> {
    return mapTask(await prisma.task.create({ data: { title: input.title, category: input.category, priority: input.priority, completed: input.completed ?? false } }));
  }

  async findMany(input: { completed?: boolean; skip: number; take: number }) {
    const where = input.completed === undefined ? {} : { completed: input.completed };
    const [items, total] = await Promise.all([
      prisma.task.findMany({ where, skip: input.skip, take: input.take, orderBy: { createdAt: 'desc' } }),
      prisma.task.count({ where }),
    ]);
    return { items: items.map(mapTask), total };
  }

  async findById(id: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    return task ? mapTask(task) : null;
  }

  async update(id: string, input: { title?: string; completed?: boolean }) {
    try {
      return mapTask(await prisma.task.update({ where: { id }, data: input }));
    } catch (error) {
      if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') return null;
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await prisma.task.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') return false;
      throw error;
    }
  }
}
