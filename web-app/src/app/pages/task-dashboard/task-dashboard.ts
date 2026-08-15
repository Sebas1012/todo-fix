import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TaskCategory, TaskSort, TaskStatus } from '../../models/task/task.model';
import { TaskService } from '../../services/task/task.service';
import { TaskFiltersComponent, TaskFilterState } from './task-filters/task-filters';
import { TaskCreateDrawerComponent } from './task-create-drawer/task-create-drawer';
import { TaskListComponent } from './task-list/task-list';
import { TaskMetricsComponent } from './task-metrics/task-metrics';
import { IconComponent } from '../../shared/components/icon/icon';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [TaskCreateDrawerComponent, TaskFiltersComponent, TaskListComponent, TaskMetricsComponent, IconComponent, NavbarComponent],
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDashboard implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly isFormOpen = signal(false);
  readonly isUserMenuOpen = signal(false);
  readonly filters = signal<TaskFilterState>({ category: 'All', status: 'Todos', search: '', sort: 'Fecha de creación' });
  readonly tasks = this.taskService.tasks;
  readonly loading = this.taskService.loading;
  readonly togglingTaskIds = this.taskService.togglingTaskIds;
  readonly error = this.taskService.error;
  readonly currentUser = this.authService.currentUser;
  readonly userInitials = computed(() => this.currentUser()?.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() ?? 'IR');
  readonly completed = computed(() => this.tasks().filter((task) => task.completed).length);
  readonly pending = computed(() => this.tasks().length - this.completed());
  readonly progress = computed(() => this.tasks().length ? Math.round((this.completed() / this.tasks().length) * 100) : 0);
  readonly filteredTasks = computed(() => {
    const current = this.filters();
    const search = current.search.toLowerCase().trim();
    const priorityOrder = { Urgente: 1, Media: 2, Baja: 3 } as const;
    return this.tasks()
      .filter((task) => current.category === 'All' || task.category === current.category)
      .filter((task) => current.status === 'Todos' || (current.status === 'Completadas' ? task.completed : !task.completed))
      .filter((task) => task.title.toLowerCase().includes(search))
      .sort((a, b) => current.sort === 'Prioridad' ? priorityOrder[a.priority] - priorityOrder[b.priority] : a.createdAt.localeCompare(b.createdAt));
  });
  readonly categories = computed(() => {
    const counts: Record<TaskCategory, number> = { FrontEnd: 0, BackEnd: 0, Docs: 0 };
    for (const task of this.tasks()) counts[task.category] += 1;
    return counts;
  });
  readonly categorySummary = computed(() =>
    (['FrontEnd', 'BackEnd', 'Docs'] as const).map((label) => ({ label, count: this.categories()[label] })),
  );

  ngOnInit(): void { void this.taskService.loadTasks(); }

  addTask(input: Parameters<TaskService['addTask']>[0]): void { void this.taskService.addTask(input); }
  toggleTask(id: string): void { void this.taskService.toggleTask(id); }
  deleteTask(id: string): void { void this.taskService.deleteTask(id); }
  async logout(): Promise<void> {
    this.isUserMenuOpen.set(false);
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
  updateFilters(next: TaskFilterState): void { this.filters.set(next); }

  setStatus(status: TaskStatus): void { this.updateFilters({ ...this.filters(), status }); }
  setCategory(category: TaskCategory | 'All'): void { this.updateFilters({ ...this.filters(), category }); }
  setSort(sort: TaskSort): void { this.updateFilters({ ...this.filters(), sort }); }
}
