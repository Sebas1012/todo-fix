import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning';

export interface AlertOptions {
  readonly type: AlertType;
  readonly title: string;
  readonly message: string;
  readonly duration?: number;
}

export interface AlertState extends AlertOptions {
  readonly id: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly alertState = signal<AlertState | null>(null);
  private readonly leavingState = signal(false);
  private hideTimer: ReturnType<typeof setTimeout> | undefined;
  private removeTimer: ReturnType<typeof setTimeout> | undefined;
  private nextId = 0;

  readonly alert = this.alertState.asReadonly();
  readonly leaving = this.leavingState.asReadonly();

  show(options: AlertOptions): void {
    this.clearTimers();
    this.leavingState.set(false);
    this.alertState.set({ ...options, id: ++this.nextId });
    this.hideTimer = setTimeout(() => this.dismiss(), options.duration ?? 4_000);
  }

  success(message: string, title = 'Operación exitosa'): void {
    this.show({ type: 'success', title, message });
  }

  error(message: string, title = 'Ocurrió un error'): void {
    this.show({ type: 'error', title, message });
  }

  warning(message: string, title = 'Advertencia'): void {
    this.show({ type: 'warning', title, message });
  }

  dismiss(): void {
    if (!this.alertState()) return;

    this.clearTimers();
    this.leavingState.set(true);
    this.removeTimer = setTimeout(() => {
      this.alertState.set(null);
      this.leavingState.set(false);
    }, 280);
  }

  private clearTimers(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    if (this.removeTimer) clearTimeout(this.removeTimer);
    this.hideTimer = undefined;
    this.removeTimer = undefined;
  }
}
