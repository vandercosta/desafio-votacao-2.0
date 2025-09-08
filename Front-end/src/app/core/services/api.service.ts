import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(url, { params }).pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(url, body).pipe(catchError(this.handleError));
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(url, body).pipe(catchError(this.handleError));
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let mensagem = 'Erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      mensagem = `Erro do cliente: ${error.error.message}`;
    } else {
      mensagem = error.error?.erro || `Erro ${error.status}: ${error.message}`;
    }

    return throwError(() => new Error(mensagem));
  }
}
