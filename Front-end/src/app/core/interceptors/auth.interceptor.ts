import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);
  private router = inject(Router);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();

    let authReq = req;
    if (token) {
      authReq = req.clone({ setHeaders: { Authorization: token } });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Token inválido ou expirado
        if (error.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }

        // Sem permissão
        if (error.status === 403) {
          console.error('Você não tem permissão para acessar este recurso.');
          this.router.navigate(['/login']);
        }

        // Erros do servidor
        if (error.status >= 500) {
          console.error('Erro no servidor:', error.message);
        }

        return throwError(() => error);
      }),
    );
  }
}
