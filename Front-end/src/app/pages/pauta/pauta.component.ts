import { Component, inject, OnInit, signal } from '@angular/core';
import { PautasService } from '../../core/services/pautas.service';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IPauta } from '../../models/pauta';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pauta',
  templateUrl: './pauta.component.html',
  styleUrls: ['./pauta.component.scss'],
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class PautaComponent implements OnInit {
  private pautasService = inject(PautasService);
  private route = inject(ActivatedRoute);

  pauta$!: Observable<IPauta>;

  private pautaId = this.route.snapshot.paramMap.get('id')!;

  pauta = signal<IPauta | null>(null);

  ngOnInit(): void {
    this.pautasService.getPautaById(this.pautaId).subscribe((p) => {
      this.pauta.set(p);
    });
  }

  votar(voto: 'SIM' | 'NÃO'): void {
    this.pautasService.postVoto(this.pautaId, { voto }).subscribe({
      next: () => {
        const pauta = this.pauta();
        if (pauta) {
          if (voto === 'SIM') pauta.votosSim++;
          else pauta.votosNao++;
          pauta.jaVotou = true;
          this.pauta.set({ ...pauta });
        }
      },
      error: (err) => {
        alert(err.error?.error || 'Erro ao votar');
      },
    });
  }

  get podeVotar(): boolean {
    const pauta = this.pauta();
    if (!pauta) return false;
    const expirou = new Date(pauta.dataExpiracao) < new Date();
    return !pauta.jaVotou && !expirou;
  }

  get statusPauta(): string | null {
    const pauta = this.pauta();
    if (!pauta) return null;

    const expirou = new Date(pauta.dataExpiracao) < new Date();
    if (!expirou) return null; // só mostra depois que expira

    // regra: maioria dos votos foi SIM
    return pauta.votosSim > pauta.votosNao ? 'Aprovada' : 'Reprovada';
  }
}
