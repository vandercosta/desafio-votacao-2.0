import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockToken = 'abc123';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: spy },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(AuthService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    // Limpa localStorage antes de cada teste
    localStorage.clear();
  });

  it('deve fazer login e salvar o token no localStorage', (done) => {
    apiServiceSpy.post.and.returnValue(of({ token: mockToken }));

    service.login('usuario', 'senha').subscribe((res) => {
      expect(res.token).toBe(mockToken);
      expect(localStorage.getItem('token')).toBe(mockToken);
      done();
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('/api/auth/login', {
      username: 'usuario',
      password: 'senha',
    });
  });

  it('deve remover o token ao fazer logout', () => {
    localStorage.setItem('token', mockToken);
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('deve retornar o token salvo', () => {
    localStorage.setItem('token', mockToken);
    expect(service.getToken()).toBe(mockToken);
  });

  it('deve retornar true se estiver logado', () => {
    localStorage.setItem('token', mockToken);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('deve retornar false se não estiver logado', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });
});
