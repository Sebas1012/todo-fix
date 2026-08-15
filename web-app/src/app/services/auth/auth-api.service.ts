import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { LoginCredentials, LoginResponse, RegisterCredentials } from '../../models/auth/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/auth/login`;

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.endpoint, credentials);
  }

  register(credentials: RegisterCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.endpoint.replace('/login', '/register'), credentials);
  }

  me(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(this.endpoint.replace('/login', '/me'));
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.endpoint.replace('/login', '/logout'), {});
  }
}
