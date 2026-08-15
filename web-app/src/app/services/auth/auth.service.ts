import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '../../shared/services/alert.service';
import type { AuthUser, LoginCredentials, RegisterCredentials } from '../../models/auth/auth.model';
import { AuthApiService } from './auth-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly alertService = inject(AlertService);
  private readonly userState = signal<AuthUser | null>(null);
  readonly currentUser = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.userState()));
  readonly loading = signal(false);

  async login(credentials: LoginCredentials): Promise<boolean> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(this.authApi.login(credentials));
      this.storeSession(response.data.user);
      this.alertService.success('Tu sesión fue iniciada correctamente.', 'Bienvenido(a)');
      return true;
    } catch (error: unknown) {
      this.alertService.error(this.getErrorMessage(error), 'No fue posible iniciar sesión');
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async register(credentials: RegisterCredentials): Promise<boolean> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(this.authApi.register(credentials));
      this.storeSession(response.data.user);
      this.alertService.success('Tu cuenta fue creada correctamente.', 'Registro exitoso');
      return true;
    } catch (error: unknown) {
      this.alertService.error(this.getErrorMessage(error), 'No fue posible registrarte');
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async restoreSession(): Promise<boolean> {
    if (this.userState()) return true;
    try {
      const response = await firstValueFrom(this.authApi.me());
      this.userState.set(response.data.user);
      return true;
    } catch {
      this.clearSession();
      return false;
    }
  }

  async logout(): Promise<void> {
    try { await firstValueFrom(this.authApi.logout()); } catch { /* Always clear local state. */ }
    this.clearSession();
  }

  private storeSession(user: AuthUser): void {
    this.userState.set(user);
  }

  private clearSession(): void {
    this.userState.set(null);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'No fue posible conectar con el servidor.';
      if (error.status === 401) return 'El correo o la contraseña no son correctos.';
      if (error.status === 400) return 'Completa los datos de acceso.';
      if (error.status >= 500) return 'Ocurrió un error interno en el servidor.';

      const payload = error.error as { error?: { message?: unknown }; message?: unknown } | null;
      const message = payload?.error?.message ?? payload?.message;
      if (typeof message === 'string') return message;
    }

    return 'No fue posible iniciar sesión.';
  }
}
