import { Component, inject, OnInit, signal } from '@angular/core';
import { PautasService } from '../../core/services/pautas.service';

import { IPauta } from '../../models/pauta';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private pautasService = inject(PautasService);
  private router = inject(Router);

  categorias$ = this.pautasService.getCategorias();
  pautas$ = this.pautasService.getPautas();

  mensagem = 'Pautas em votação';

  filtroSelecionado = signal<string>('todos');

  isAdmin = signal(false);

  ngOnInit(): void {
    console.log('Pautas em votação');
    this.isAdmin.set(this.authService.getAdmin() === 'true');
  }

  abrirDetalhe(pauta: IPauta): void {
    this.router.navigate(['/pautas', pauta._id]);
  }

  cadastrarPauta(): void {
    this.router.navigate(['/cadastrar-pauta']);
  }

  listarUsuarios(): void {
    this.router.navigate(['/lista-usuario']);
  }

  filtrar(): void {
    this.pautas$ = this.pautasService.getPautas(this.filtroSelecionado());
  }
}
