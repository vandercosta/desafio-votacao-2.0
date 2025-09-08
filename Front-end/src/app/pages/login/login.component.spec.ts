import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],

      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o formulário com campos username e password', () => {
    expect(component.form.contains('username')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();
  });

  it('não deve chamar login se o formulário estiver inválido', () => {
    component.form.setValue({ username: '', password: '' });
    component.login();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('deve atualizar errorMessage em caso de erro', () => {
    const mockError = new Error('Credenciais inválidas');
    authServiceSpy.login.and.returnValue(throwError(() => mockError));

    component.form.setValue({ username: 'user', password: 'wrongpass' });
    component.login();

    expect(component.errorMessage()).toBe('Credenciais inválidas');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
