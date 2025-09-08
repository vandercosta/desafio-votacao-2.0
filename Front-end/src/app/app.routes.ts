import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { PautaComponent } from './pages/pauta/pauta.component';
import { CadastroPautaComponent } from './pages/cadastro-pauta/cadastro-pauta.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'cadastrar-pauta', component: CadastroPautaComponent, canActivate: [AuthGuard] },
  { path: 'pautas', redirectTo: 'home', pathMatch: 'full' },
  { path: 'pautas/:id', component: PautaComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
];
