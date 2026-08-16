import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('calls login, register, me and logout endpoints', () => {
    service.login({ email: 'ada@example.com', password: 'password' }).subscribe();
    const login = http.expectOne({ method: 'POST', url: 'http://localhost:3000/api/auth/login' });
    expect(login.request.body).toEqual({ email: 'ada@example.com', password: 'password' });
    login.flush({ data: { user: { id: 'u1', fullName: 'Ada', email: 'ada@example.com' } } });

    service.register({ fullName: 'Ada', email: 'ada@example.com', password: 'password' }).subscribe();
    http.expectOne({ method: 'POST', url: 'http://localhost:3000/api/auth/register' }).flush({ data: { user: { id: 'u1', fullName: 'Ada', email: 'ada@example.com' } } });

    service.me().subscribe();
    http.expectOne({ method: 'GET', url: 'http://localhost:3000/api/auth/me' }).flush({ data: { user: { id: 'u1', fullName: 'Ada', email: 'ada@example.com' } } });

    service.logout().subscribe();
    http.expectOne({ method: 'POST', url: 'http://localhost:3000/api/auth/logout' }).flush(null);
  });
});
