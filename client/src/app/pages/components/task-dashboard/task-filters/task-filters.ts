import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TaskCategory, TaskSort, TaskStatus } from '../../../../models/task.model';

export interface TaskFilterState { readonly category: TaskCategory | 'All'; readonly status: TaskStatus; readonly search: string; readonly sort: TaskSort; }

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [FormsModule, SelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.css',
})
export class TaskFiltersComponent {
  readonly filtersChanged = output<TaskFilterState>();
  readonly categories: readonly (TaskCategory | 'All')[] = ['All', 'Backend', 'Frontend', 'DevOps', 'Docs'];
  readonly category = signal<TaskCategory | 'All'>('All');
  readonly status = signal<TaskStatus>('All');
  readonly search = signal('');
  readonly sort = signal<TaskSort>('Due date');
  readonly statuses: TaskStatus[] = ['All', 'Pending', 'Completed'];
  readonly sortOptions: TaskSort[] = ['Due date', 'Priority'];

  emit(): void { this.filtersChanged.emit({ category: this.category(), status: this.status(), search: this.search(), sort: this.sort() }); }
}
