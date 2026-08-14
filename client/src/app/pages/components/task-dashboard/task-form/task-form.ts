import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CreateTaskInput, TaskCategory, TaskPriority } from '../../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, SelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskFormComponent {
  readonly taskCreated = output<CreateTaskInput>();
  readonly categories: TaskCategory[] = ['Backend', 'Frontend', 'DevOps', 'Docs'];
  readonly priorities: TaskPriority[] = ['High', 'Medium', 'Low'];
  readonly title = signal('');
  category: TaskCategory = 'Frontend';
  priority: TaskPriority = 'Medium';

  submit(): void {
    const title = this.title().trim();
    if (!title) return;
    this.taskCreated.emit({ title, category: this.category, priority: this.priority, date: 'Not set' });
    this.title.set('');
  }
}
