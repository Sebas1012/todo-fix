import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  it('allows an authenticated user', () => {
    const auth = { isAuthenticated: () => true, restoreSession: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: auth }, { provide: Router, useValue: {} }] });
    expect(TestBed.runInInjectionContext(() => authGuard({} as never, {} as never))).toBe(true);
    expect(auth.restoreSession).not.toHaveBeenCalled();
  });

  it('restores a valid session', async () => {
    const auth = { isAuthenticated: () => false, restoreSession: vi.fn().mockResolvedValue(true) };
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: auth }, { provide: Router, useValue: {} }] });
    await expect(TestBed.runInInjectionContext(() => authGuard({} as never, {} as never))).resolves.toBe(true);
  });

  it('redirects when session restoration fails', async () => {
    const urlTree = { redirect: '/login' };
    const auth = { isAuthenticated: () => false, restoreSession: vi.fn().mockResolvedValue(false) };
    const router = { createUrlTree: vi.fn().mockReturnValue(urlTree) };
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: auth }, { provide: Router, useValue: router }] });
    await expect(TestBed.runInInjectionContext(() => authGuard({} as never, {} as never))).resolves.toBe(urlTree);
  });
});
