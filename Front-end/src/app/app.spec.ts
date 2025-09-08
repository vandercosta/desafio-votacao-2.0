import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthService } from './core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

describe('App', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['getAdmin']);

    await TestBed.configureTestingModule({
      imports: [App, MatButtonModule],
      providers: [{ provide: AuthService, useValue: spy }, provideZonelessChangeDetection()],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.getAdmin.and.returnValue('false');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
