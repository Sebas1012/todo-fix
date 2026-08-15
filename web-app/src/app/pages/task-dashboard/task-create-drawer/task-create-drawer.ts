import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from '../task-form/task-form';
import { IconComponent } from '../../../shared/components/icon/icon';
import { CreateTaskInput, Task, TaskCategory } from '../../../models/task/task.model';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-task-create-drawer',
  standalone: true,
  imports: [FormsModule, IconComponent, SelectModule, TaskFormComponent],
  templateUrl: './task-create-drawer.html',
  styleUrl: './task-create-drawer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class TaskCreateDrawerComponent {
  readonly open = input(false);
  readonly tasks = input<readonly Task[]>([]);
  readonly closed = output<void>();
  readonly taskCreated = output<CreateTaskInput>();
  readonly taskDeleted = output<string>();

  readonly search = signal('');
  readonly category = signal<TaskCategory | 'All'>('All');
  readonly categoryOptions = [
    { label: 'Todas las categorías', value: 'All' as const },
    { label: 'FrontEnd', value: 'FrontEnd' as const },
    { label: 'BackEnd', value: 'BackEnd' as const },
    { label: 'Docs', value: 'Docs' as const },
  ];

  readonly filteredTasks = computed(() => {
    const search = this.search().trim().toLowerCase();
    const category = this.category();

    return this.tasks().filter((task) =>
      (category === 'All' || task.category === category) &&
      task.title.toLowerCase().includes(search),
    );
  });

  close(): void {
    this.closed.emit();
  }

  onEscape(): void {
    if (this.open()) this.close();
  }

  clearSearch(): void {
    this.search.set('');
  }

  handleTaskCreated(input: CreateTaskInput): void {
    this.taskCreated.emit(input);
  }

  taskTrack(_index: number, task: Task): string {
    return task.id;
  }
}
