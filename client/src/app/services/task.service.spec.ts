import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('starts without mock tasks', () => {
    expect(service.tasks()).toEqual([]);
  });

  it('creates, toggles and deletes a task', () => {
    service.addTask({ title: 'Create API', category: 'Backend', priority: 'High', date: 'Not set' });
    const task = service.tasks()[0];

    expect(task.title).toBe('Create API');
    expect(task.completed).toBe(false);

    service.toggleTask(task.id);
    expect(service.tasks()[0].completed).toBe(true);

    service.deleteTask(task.id);
    expect(service.tasks()).toEqual([]);
  });

  it('does not create empty task titles', () => {
    service.addTask({ title: '   ', category: 'Docs', priority: 'Low', date: 'Not set' });
    expect(service.tasks()).toEqual([]);
  });
});
