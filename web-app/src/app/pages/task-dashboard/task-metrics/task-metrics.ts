import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-task-metrics',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-metrics.html',
  styleUrl: './task-metrics.css',
})
export class TaskMetricsComponent {
  readonly total = input(0);
  readonly completed = input(0);
  readonly pending = input(0);
  readonly progress = input(0);
}
