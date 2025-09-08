import { Component, inject, OnInit, signal } from '@angular/core';
import { PautasService } from '../../core/services/pautas.service';

import { IPauta } from '../../models/pauta';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private pautasService = inject(PautasService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  categorias$ = this.pautasService.getCategorias();
  pautas$ = this.pautasService.getPautas();

  mensagem = 'Pautas em votação';

  filtroSelecionado = signal<string>('todos');

  isAdmin = signal(false);

  cols = signal(3);

  ngOnInit(): void {
    console.log('Pautas em votação');
    this.isAdmin.set(this.authService.getAdmin() === 'true');

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XSmall]) this.cols.set(1);
        else if (result.breakpoints[Breakpoints.Small]) this.cols.set(2);
        else this.cols.set(3);
      });
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
