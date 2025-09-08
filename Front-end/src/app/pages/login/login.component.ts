import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup;
  errorMessage = signal<string | null>(null); // usando signal do Angular

  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('LoginComponent');
  }

  login(): void {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

    this.auth
      .login(username, password)
      .pipe(
        catchError((err) => {
          this.errorMessage.set(err.message); // atualiza o signal
          return of(null); // evita que o observable quebre
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/home']);
        }
      });
  }
}
