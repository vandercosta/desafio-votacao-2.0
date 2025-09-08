import { Component, inject, OnInit, signal } from '@angular/core';
import { PautasService } from '../../core/services/pautas.service';

import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategoria } from '../../models/categoria';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { IPauta } from '../../models/pauta';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cadastro-pauta',
  templateUrl: './cadastro-pauta.component.html',
  styleUrls: ['./cadastro-pauta.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class CadastroPautaComponent implements OnInit {
  private pautasService = inject(PautasService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  categorias$: Observable<ICategoria[]> = this.pautasService.getCategorias(); // suposição que você tem esse endpoint

  pautaCriada = signal<IPauta | null>(null);
  erroCadastro = signal<string | null>(null);

  pautaForm = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descricao: ['', [Validators.required, Validators.minLength(5)]],
    dataExpiracao: ['', Validators.required],
    categoria: ['', Validators.required],
  });

  ngOnInit(): void {
    console.log('cadastro-pauta.component');
  }

  cadastrarPauta(): void {
    if (this.pautaForm.invalid) {
      this.pautaForm.markAllAsTouched();
      return;
    }

    this.pautasService.postCadastrarPauta(this.pautaForm.value).subscribe({
      next: (res) => {
        this.pautaCriada.set(res);
        this.erroCadastro.set(null);
        this.pautaForm.reset();
      },
      error: (err) => {
        console.error('Erro ao criar pauta:', err);
        alert(err.error?.error || 'Erro ao criar pauta');
      },
    });
  }
}
