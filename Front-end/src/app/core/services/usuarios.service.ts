import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IUsuario } from '../../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private api = inject(ApiService);

  getUsuarios(): Observable<IUsuario[]> {
    return this.api.get(`/api/usuarios`);
  }

  postCadastrarUsuario(body: unknown): Observable<IUsuario> {
    return this.api.post(`/api/usuarios`, body);
  }
}
