import { describe, expect, it } from 'vitest';
import { CreateTask, ListTasks } from '../src/modules/tasks/application/tasks.js';
import type { Task, TaskRepository } from '../src/modules/tasks/domain/task.js';

const task = (title: string): Task => ({ id: '1', title, category: 'FrontEnd', priority: 'Media', completed: false, createdAt: new Date(), updatedAt: new Date() });

describe('task use cases', () => {
  it('trims and creates a non-empty task', async () => {
    const repository: TaskRepository = { create: async (_userId, { title }) => task(title), findMany: async () => ({ items: [], total: 0 }), findById: async () => null, update: async () => null, delete: async () => false };
    await expect(new CreateTask(repository).execute('user-1', { title: '  Buy milk  ', category: 'FrontEnd', priority: 'Media' })).resolves.toMatchObject({ title: 'Buy milk' });
  });

  it('rejects empty titles', async () => {
    const repository = {} as TaskRepository;
    await expect(new CreateTask(repository).execute('user-1', { title: '   ', category: 'FrontEnd', priority: 'Media' })).rejects.toMatchObject({ statusCode: 400 });
  });
});
