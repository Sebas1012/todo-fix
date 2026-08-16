import { describe, expect, it } from 'vitest';
import { createTaskSchema, idSchema, listTasksSchema, updateTaskSchema } from '../../../src/modules/tasks/interfaces/schemas/task.schemas.js';

describe('task schemas', () => {
  it('validates task ids and creates tasks', () => {
    expect(idSchema.parse('507f1f77bcf86cd799439011')).toBe('507f1f77bcf86cd799439011');
    expect(createTaskSchema.parse({ title: 'Task', category: 'Docs', priority: 'Urgente' })).toEqual({ title: 'Task', category: 'Docs', priority: 'Urgente' });
  });

  it('rejects invalid ids and unknown task fields', () => {
    expect(() => idSchema.parse('not-an-object-id')).toThrow();
    expect(() => createTaskSchema.parse({ title: 'Task', category: 'Docs', priority: 'Media', extra: true })).toThrow();
  });

  it('parses pagination defaults and filters', () => {
    expect(listTasksSchema.parse({ completed: 'true', page: '2', limit: '10' })).toEqual({ completed: 'true', page: 2, limit: 10 });
    expect(listTasksSchema.parse({})).toEqual({ page: 1, limit: 20 });
  });

  it('requires at least one update field', () => {
    expect(() => updateTaskSchema.parse({})).toThrow();
    expect(updateTaskSchema.parse({ completed: true })).toEqual({ completed: true });
  });
});
