import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAdmin = signal(false);

  ngOnInit(): void {
    this.isAdmin.set(this.authService.getAdmin() === 'true');
  }

  cadastrarPauta(): void {
    this.router.navigate(['/cadastrar-pauta']);
  }

  listarUsuarios(): void {
    this.router.navigate(['/lista-usuario']);
  }

  listarPautas(): void {
    this.router.navigate(['/home']);
  }
}
