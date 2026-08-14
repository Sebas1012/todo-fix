import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent {
  readonly tasks = input<readonly Task[]>([]);
  readonly taskToggled = output<number>();
  readonly taskDeleted = output<number>();
}
