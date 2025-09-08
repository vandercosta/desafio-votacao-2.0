import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly IS_ADMIN = 'isAdmin';

  private api = inject(ApiService);

  login(
    username: string,
    password: string,
  ): Observable<{
    token: string;
    isAdmin: boolean;
  }> {
    return this.api
      .post<{ token: string; isAdmin: boolean }>('/api/auth/login', { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.IS_ADMIN, res.isAdmin.toString());
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.IS_ADMIN);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getAdmin(): string | null {
    return localStorage.getItem(this.IS_ADMIN);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
