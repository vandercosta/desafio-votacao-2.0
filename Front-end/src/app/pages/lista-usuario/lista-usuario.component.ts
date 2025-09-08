import { Component, inject, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../core/services/usuarios.service';
import { IUsuario } from '../../models/usuario';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ListaUsuarioComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  listaUsuarios = signal<IUsuario[]>([]);
  mensagem = signal<string | null>(null);

  ngOnInit(): void {
    console.log('lista-usuario.component');
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (res: IUsuario[]) => {
        this.listaUsuarios.set(res);
        this.mensagem.set('Usuários listados com sucesso!');
      },
      error: (err) => {
        this.mensagem.set(err.error?.error || 'Erro ao listar usuários');
      },
    });
  }

  cadastrarUsuario(): void {
    this.router.navigate(['/cadastrar-usuario']);
  }
}
