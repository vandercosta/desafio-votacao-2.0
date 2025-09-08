import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { IPauta } from '../../models/pauta';
import { ICategoria } from '../../models/categoria';

@Injectable({
  providedIn: 'root',
})
export class PautasService {
  private api = inject(ApiService);

  getPautas(): Observable<IPauta[]> {
    return this.api.get('/api/pautas');
  }

  getPautaById(id: string): Observable<IPauta> {
    return this.api.get(`/api/pautas/${id}`);
  }

  postVoto(id: string, body: unknown): Observable<IPauta> {
    return this.api.post(`/api/pautas/${id}/votar`, body);
  }

  postCadastrarPauta(body: unknown): Observable<IPauta> {
    return this.api.post(`/api/pautas`, body);
  }

  getCategorias(): Observable<ICategoria[]> {
    return this.api.get('/api/categorias');
  }
}
