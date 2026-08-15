import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { LoginCredentials, LoginResponse } from '../../models/auth/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/auth/login`;

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.endpoint, credentials);
  }

  register(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.endpoint.replace('/login', '/register'), credentials);
  }
}
