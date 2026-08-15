import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlertService, AlertType } from '../../services/alert.service';
import { IconComponent } from '../icon/icon';
import type { IconName } from '../icon/icon';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private readonly alertService = inject(AlertService);

  readonly alert = this.alertService.alert;
  readonly leaving = this.alertService.leaving;
  readonly icons: Record<AlertType, IconName> = {
    success: 'check-circle',
    error: 'alert-circle',
    warning: 'alert-triangle',
  };

  dismiss(): void {
    this.alertService.dismiss();
  }
}
