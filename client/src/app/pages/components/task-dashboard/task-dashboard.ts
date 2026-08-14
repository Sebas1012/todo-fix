import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TaskCategory, TaskSort, TaskStatus } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';
import { TaskFiltersComponent, TaskFilterState } from './task-filters/task-filters';
import { TaskFormComponent } from './task-form/task-form';
import { TaskListComponent } from './task-list/task-list';
import { TaskMetricsComponent } from './task-metrics/task-metrics';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [TaskFormComponent, TaskFiltersComponent, TaskListComponent, TaskMetricsComponent, IconComponent],
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDashboard {
  private readonly taskService = inject(TaskService);
  readonly isFormOpen = signal(false);
  readonly filters = signal<TaskFilterState>({ category: 'All', status: 'All', search: '', sort: 'Due date' });
  readonly tasks = this.taskService.tasks;
  readonly completed = computed(() => this.tasks().filter((task) => task.completed).length);
  readonly pending = computed(() => this.tasks().length - this.completed());
  readonly progress = computed(() => this.tasks().length ? Math.round((this.completed() / this.tasks().length) * 100) : 0);
  readonly filteredTasks = computed(() => {
    const current = this.filters();
    const search = current.search.toLowerCase().trim();
    const priorityOrder = { High: 1, Medium: 2, Low: 3 } as const;
    return this.tasks()
      .filter((task) => current.category === 'All' || task.category === current.category)
      .filter((task) => current.status === 'All' || (current.status === 'Completed' ? task.completed : !task.completed))
      .filter((task) => task.title.toLowerCase().includes(search))
      .sort((a, b) => current.sort === 'Priority' ? priorityOrder[a.priority] - priorityOrder[b.priority] : a.id - b.id);
  });
  readonly categories = computed(() => {
    const counts: Record<TaskCategory, number> = { Backend: 0, Frontend: 0, DevOps: 0, Docs: 0 };
    for (const task of this.tasks()) counts[task.category] += 1;
    return counts;
  });
  readonly categorySummary = computed(() =>
    (['Backend', 'Frontend', 'DevOps', 'Docs'] as const).map((label) => ({ label, count: this.categories()[label] })),
  );

  addTask(input: Parameters<TaskService['addTask']>[0]): void { this.taskService.addTask(input); this.isFormOpen.set(false); }
  toggleTask(id: number): void { this.taskService.toggleTask(id); }
  deleteTask(id: number): void { this.taskService.deleteTask(id); }
  updateFilters(next: TaskFilterState): void { this.filters.set(next); }

  setStatus(status: TaskStatus): void { this.updateFilters({ ...this.filters(), status }); }
  setCategory(category: TaskCategory | 'All'): void { this.updateFilters({ ...this.filters(), category }); }
  setSort(sort: TaskSort): void { this.updateFilters({ ...this.filters(), sort }); }
}
