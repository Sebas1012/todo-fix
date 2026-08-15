import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '../../shared/services/alert.service';
import type { LoginCredentials } from '../../models/auth/auth.model';
import { AuthApiService } from './auth-api.service';

const TOKEN_KEY = 'iris.auth.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly alertService = inject(AlertService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenState = signal<string | null>(this.readToken());
  readonly token = this.tokenState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.tokenState()));
  readonly loading = signal(false);

  async login(credentials: LoginCredentials): Promise<boolean> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(this.authApi.login(credentials));
      this.storeToken(response.data.token);
      this.alertService.success('Tu sesión fue iniciada correctamente.', 'Bienvenido(a)');
      return true;
    } catch (error: unknown) {
      this.alertService.error(this.getErrorMessage(error), 'No fue posible iniciar sesión');
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async register(credentials: LoginCredentials): Promise<boolean> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(this.authApi.register(credentials));
      this.storeToken(response.data.token);
      this.alertService.success('Tu cuenta fue creada correctamente.', 'Registro exitoso');
      return true;
    } catch (error: unknown) {
      this.alertService.error(this.getErrorMessage(error), 'No fue posible registrarte');
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.clearToken();
  }

  private storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) localStorage.setItem(TOKEN_KEY, token);
    this.tokenState.set(token);
  }

  private clearToken(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem(TOKEN_KEY);
    this.tokenState.set(null);
  }

  private readToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(TOKEN_KEY) : null;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'No fue posible conectar con el servidor.';
      if (error.status === 401) return 'El usuario o la contraseña no son correctos.';
      if (error.status === 400) return 'Completa los datos de acceso.';
      if (error.status >= 500) return 'Ocurrió un error interno en el servidor.';

      const payload = error.error as { error?: { message?: unknown }; message?: unknown } | null;
      const message = payload?.error?.message ?? payload?.message;
      if (typeof message === 'string') return message;
    }

    return 'No fue posible iniciar sesión.';
  }
}
