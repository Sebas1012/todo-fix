import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthApiService } from './auth-api.service';
import { AuthService } from './auth.service';
import { AlertService } from '../../shared/services/alert.service';

const user = { id: 'user-1', fullName: 'Ada Lovelace', email: 'ada@example.com' };

describe('AuthService', () => {
  let service: AuthService;
  let api: { login: ReturnType<typeof vi.fn>; register: ReturnType<typeof vi.fn>; me: ReturnType<typeof vi.fn>; logout: ReturnType<typeof vi.fn> };
  let alert: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    api = { login: vi.fn(), register: vi.fn(), me: vi.fn(), logout: vi.fn() };
    alert = { success: vi.fn(), error: vi.fn() };
    TestBed.configureTestingModule({ providers: [AuthService, { provide: AuthApiService, useValue: api }, { provide: AlertService, useValue: alert }] });
    service = TestBed.inject(AuthService);
  });

  it('stores the user after login and register', async () => {
    api.login.mockReturnValue(of({ data: { user } }));
    expect(await service.login({ email: user.email, password: 'password' })).toBe(true);
    expect(service.currentUser()).toEqual(user);
    expect(service.isAuthenticated()).toBe(true);
    expect(alert.success).toHaveBeenCalled();

    api.logout.mockReturnValue(of(void 0));
    await service.logout();
    api.register.mockReturnValue(of({ data: { user } }));
    expect(await service.register({ ...user, password: 'password' })).toBe(true);
  });

  it('maps login errors and clears loading', async () => {
    api.login.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    expect(await service.login({ email: user.email, password: 'password' })).toBe(false);
    expect(service.loading()).toBe(false);
    expect(alert.error).toHaveBeenCalledWith('El correo o la contraseña no son correctos.', 'No fue posible iniciar sesión');
  });

  it('restores and clears a session', async () => {
    api.me.mockReturnValue(of({ data: { user } }));
    expect(await service.restoreSession()).toBe(true);
    expect(service.currentUser()).toEqual(user);

    api.logout.mockReturnValue(of(void 0));
    await service.logout();
    api.me.mockReturnValue(throwError(() => new Error('expired')));
    expect(await service.restoreSession()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('clears local state when logout request fails', async () => {
    api.login.mockReturnValue(of({ data: { user } }));
    await service.login({ email: user.email, password: 'password' });
    api.logout.mockReturnValue(throwError(() => new Error('offline')));
    await service.logout();
    expect(service.currentUser()).toBeNull();
  });
});
