import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task } from '../../../models/task/task.model';
import { IconComponent } from '../../../shared/components/icon/icon';
import type { IconName } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent {
  readonly tasks = input<readonly Task[]>([]);
  readonly taskToggled = output<string>();
  readonly taskDeleted = output<string>();
  readonly categoryIcons: Record<Task['category'], IconName> = {
    FrontEnd: 'code',
    BackEnd: 'database',
    Docs: 'file',
  };

  toggleFromCard(event: MouseEvent, taskId: string): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, label, input, a')) {
      return;
    }

    this.taskToggled.emit(taskId);
  }

  toggleFromKeyboard(event: KeyboardEvent, taskId: string): void {
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
}
