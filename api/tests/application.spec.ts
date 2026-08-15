import { describe, expect, it } from 'vitest';
import { CreateTask, ListTasks } from '../src/application/tasks.js';
import type { Task, TaskRepository } from '../src/domain/tasks/task.js';

const task = (title: string): Task => ({ id: '1', title, category: 'FrontEnd', priority: 'Media', completed: false, createdAt: new Date(), updatedAt: new Date() });

describe('task use cases', () => {
  it('trims and creates a non-empty task', async () => {
    const repository: TaskRepository = { create: async ({ title }) => task(title), findMany: async () => ({ items: [], total: 0 }), findById: async () => null, update: async () => null, delete: async () => false };
    await expect(new CreateTask(repository).execute({ title: '  Buy milk  ', category: 'FrontEnd', priority: 'Media' })).resolves.toMatchObject({ title: 'Buy milk' });
  });

  it('rejects empty titles', async () => {
    const repository = {} as TaskRepository;
    await expect(new CreateTask(repository).execute({ title: '   ', category: 'FrontEnd', priority: 'Media' })).rejects.toMatchObject({ statusCode: 400 });
  });
});
