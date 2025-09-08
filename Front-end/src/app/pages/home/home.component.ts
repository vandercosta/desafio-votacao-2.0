import { Component, inject, OnInit } from '@angular/core';
import { PautasService } from '../../core/services/pautas.service';
import { Observable } from 'rxjs';
import { IPauta } from '../../models/pauta';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  private pautasService = inject(PautasService);
  private router = inject(Router);

  mensagem = 'Pautas em votação';
  pautas$!: Observable<IPauta[]>;

  now = new Date();

  ngOnInit(): void {
    this.pautas$ = this.pautasService.getPautas();
  }

  abrirDetalhe(pauta: IPauta): void {
    this.router.navigate(['/pautas', pauta._id]);
  }

  cadastrarPauta(): void {
    this.router.navigate(['/cadastrar-pauta']);
  }
}
