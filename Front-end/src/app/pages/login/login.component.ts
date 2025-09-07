import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule],
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
