import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'calendar'
  | 'check-circle'
  | 'clock'
  | 'grid'
  | 'list'
  | 'search'
  | 'settings'
  | 'chart'
  | 'target'
  | 'folder'
  | 'sliders'
  | 'more'
  | 'arrow-up-down'
  | 'code'
  | 'database'
  | 'file'
  | 'check'
  | 'alert-circle'
  | 'alert-triangle'
  | 'logout'
  | 'user';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.html',
  styleUrl: './icon.css',
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly label = input<string>();
}
