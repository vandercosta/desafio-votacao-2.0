import { Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../core/services/usuarios.service';
import { IUsuario } from '../../models/usuario';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CadastroUsuarioComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private fb = inject(FormBuilder);
  // private router = inject(Router);

  usuarioForm!: FormGroup;
  mensagem: string | null = null;

  // usuarioCadastrado: IUsuario | null = null;

  ngOnInit(): void {
    console.log('cadastro-usuario.component');
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isAdmin: [false],
    });
  }

  cadastrarUsuario(): void {
    if (this.usuarioForm.invalid) return;

    this.usuariosService.postCadastrarUsuario(this.usuarioForm.value).subscribe({
      next: (res) => {
        console.log('res', res);
        this.mensagem = 'Usuário cadastrado com sucesso!';
        this.usuarioForm.reset();
      },
      error: (err) => {
        this.mensagem = err.error?.error || 'Erro ao cadastrar usuário';
      },
    });
  }
}
