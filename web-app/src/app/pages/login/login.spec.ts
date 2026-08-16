import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { AuthService } from '../../services/auth/auth.service';
import { LoginPage } from './login';

describe('LoginPage', () => {
  const setup = (authenticated = true) => {
    const auth = { loading: signal(false), login: vi.fn().mockResolvedValue(authenticated) };
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: auth }] });
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    return { fixture: TestBed.createComponent(LoginPage), auth, router };
  };

  it('marks invalid fields and does not call the API', async () => {
    const { fixture, auth } = setup();
    await fixture.componentInstance.submit();

    expect(fixture.componentInstance.form.controls.email.touched).toBe(true);
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('logs in and navigates to tasks', async () => {
    const { fixture, auth, router } = setup();
    fixture.componentInstance.form.setValue({ email: 'ada@example.com', password: 'password' });

    await fixture.componentInstance.submit();

    expect(auth.login).toHaveBeenCalledWith({ email: 'ada@example.com', password: 'password' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/tasks');
  });

  it('toggles password visibility', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance.showPassword()).toBe(false);
    fixture.componentInstance.togglePassword();
    expect(fixture.componentInstance.showPassword()).toBe(true);
  });
});
