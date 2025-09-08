import { Component, inject, OnInit, signal } from '@angular/core';
import { PautasService } from '../../core/services/pautas.service';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IPauta } from '../../models/pauta';

@Component({
  selector: 'app-pauta',
  templateUrl: './pauta.component.html',
  styleUrls: ['./pauta.component.scss'],
  imports: [CommonModule],
})
export class PautaComponent implements OnInit {
  private pautasService = inject(PautasService);
  private route = inject(ActivatedRoute);

  pauta$!: Observable<IPauta>;

  private pautaId = this.route.snapshot.paramMap.get('id')!;

  pauta = signal<IPauta | null>(null); // WritableSignal

  ngOnInit(): void {
    this.pautasService.getPautaById(this.pautaId).subscribe((p) => {
      this.pauta.set(p); // agora funciona
    });
  }

  votar(voto: 'SIM' | 'NÃO'): void {
    this.pautasService.postVoto(this.pautaId, { voto }).subscribe({
      next: () => {
        const p = this.pauta();
        if (p) {
          if (voto === 'SIM') p.votosSim++;
          else p.votosNao++;
          p.jaVotou = true;
          this.pauta.set({ ...p });
        }
      },
      error: (err) => {
        alert(err.error?.error || 'Erro ao votar');
      },
    });
  }
}
