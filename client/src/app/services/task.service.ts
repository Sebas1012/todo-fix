import { Injectable, signal } from '@angular/core';
import { CreateTaskInput, Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly tasksState = signal<readonly Task[]>([]);
  private nextId = 1;

  readonly tasks = this.tasksState.asReadonly();

  addTask(input: CreateTaskInput): void {
    const title = input.title.trim();
    if (!title) return;

    this.tasksState.update((tasks) => [
      ...tasks,
      { ...input, title, id: this.nextId++, completed: false },
    ]);
  }

  toggleTask(id: number): void {
    this.tasksState.update((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  deleteTask(id: number): void {
    this.tasksState.update((tasks) => tasks.filter((task) => task.id !== id));
  }
}
