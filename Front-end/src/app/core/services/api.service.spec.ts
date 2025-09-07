import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // fornece HttpClient
        provideHttpClientTesting(), // fornece HttpTestingController
        provideZonelessChangeDetection(), // modo zoneless
        ApiService, //  seu serviço
      ],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve fazer uma requisição GET', () => {
    const mockData = { nome: 'Angular' };
    const url = '/api/teste';

    service.get<typeof mockData>(url).subscribe((res) => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('deve fazer uma requisição POST', () => {
    const url = '/api/postar';
    const body = { dado: 'valor' };
    const mockResponse = { sucesso: true };

    service.post<typeof mockResponse>(url, body).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('deve fazer uma requisição PUT', () => {
    const url = '/api/atualizar';
    const body = { dado: 'novo valor' };
    const mockResponse = { atualizado: true };

    service.put<typeof mockResponse>(url, body).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('deve fazer uma requisição DELETE', () => {
    const url = '/api/remover';
    const mockResponse = { removido: true };

    service.delete<typeof mockResponse>(url).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('deve tratar erro do cliente (ErrorEvent)', () => {
    const url = '/api/erro-cliente';

    service.get(url).subscribe({
      next: () => fail('Esperava erro'),
      error: (err) => {
        expect(err.message).toContain('Erro do cliente');
      },
    });

    const req = httpMock.expectOne(url);
    const mockError = new ErrorEvent('Erro de rede', {
      message: 'Falha de conexão',
    });

    req.error(mockError);
  });

  it('deve tratar erro do servidor com mensagem personalizada', () => {
    const url = '/api/erro-servidor';

    service.get(url).subscribe({
      next: () => fail('Esperava erro'),
      error: (err) => {
        expect(err.message).toBe('Erro interno');
      },
    });

    const req = httpMock.expectOne(url);
    req.flush({ erro: 'Erro interno' }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('deve tratar erro do servidor com mensagem padrão', () => {
    const url = '/api/erro-sem-mensagem';

    service.get(url).subscribe({
      next: () => fail('Esperava erro'),
      error: (err) => {
        expect(err.message).toContain('Erro 404');
      },
    });

    const req = httpMock.expectOne(url);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });
});
