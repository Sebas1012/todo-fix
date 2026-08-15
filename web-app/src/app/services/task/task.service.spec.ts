import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

const task = {
  id: 'task-1',
  title: 'Create API',
  category: 'BackEnd' as const,
  priority: 'Urgente' as const,
  completed: false,
  createdAt: '2026-08-15T10:00:00.000Z',
  updatedAt: '2026-08-15T10:00:00.000Z',
};

describe('TaskService', () => {
  let service: TaskService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(TaskService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('starts without tasks', () => {
    expect(service.tasks()).toEqual([]);
  });

  it('only exposes loading while fetching the initial task data', async () => {
    const load = service.loadTasks();
    expect(service.loading()).toBe(true);
    http.expectOne({ method: 'GET', url: 'http://localhost:3000/api/tasks?page=1&limit=100' }).flush({ data: [] });
    await load;
    expect(service.loading()).toBe(false);

    const create = service.addTask({ title: 'Create API', category: 'BackEnd', priority: 'Urgente' });
    expect(service.loading()).toBe(false);
    http.expectOne({ method: 'POST', url: 'http://localhost:3000/api/tasks' }).flush({ data: task });
    await create;
  });

  it('creates, toggles and deletes a task through the API', async () => {
    const create = service.addTask({ title: 'Create API', category: 'BackEnd', priority: 'Urgente' });
    http.expectOne({ method: 'POST', url: 'http://localhost:3000/api/tasks' }).flush({ data: task });
    await create;
    expect(service.tasks()).toEqual([task]);

    const toggle = service.toggleTask(task.id);
    http.expectOne({ method: 'PATCH', url: 'http://localhost:3000/api/tasks/task-1' }).flush({ data: { ...task, completed: true } });
    await toggle;
    expect(service.tasks()[0].completed).toBe(true);

    const remove = service.deleteTask(task.id);
    http.expectOne({ method: 'DELETE', url: 'http://localhost:3000/api/tasks/task-1' }).flush(null, { status: 204, statusText: 'No Content' });
    await remove;
    expect(service.tasks()).toEqual([]);
  });

  it('does not create empty task titles', async () => {
    await service.addTask({ title: '   ', category: 'Docs', priority: 'Baja' });
    expect(service.tasks()).toEqual([]);
  });
});
