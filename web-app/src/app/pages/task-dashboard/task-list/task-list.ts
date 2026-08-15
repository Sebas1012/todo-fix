import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task } from '../../../models/task/task.model';
import { IconComponent } from '../../../shared/components/icon/icon';
import type { IconName } from '../../../shared/components/icon/icon';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [IconComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent {
  readonly tasks = input<readonly Task[]>([]);
  readonly togglingTaskIds = input<ReadonlySet<string>>(new Set());
  readonly taskToggled = output<string>();
  readonly taskDeleted = output<string>();
  readonly categoryIcons: Record<Task['category'], IconName> = {
    FrontEnd: 'code',
    BackEnd: 'database',
    Docs: 'file',
  };

  toggleFromCard(event: MouseEvent, taskId: string): void {
    if (this.togglingTaskIds().has(taskId)) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, label, input, a')) {
      return;
    }

    this.taskToggled.emit(taskId);
  }

  toggleFromKeyboard(event: KeyboardEvent, taskId: string): void {
    if (this.togglingTaskIds().has(taskId)) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, label, input, a')) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.taskToggled.emit(taskId);
  }

  toggleFromCheckbox(taskId: string): void {
    if (!this.togglingTaskIds().has(taskId)) this.taskToggled.emit(taskId);
  }
}
