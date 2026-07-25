import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { CurrentUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { catchError, finalize, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly router = inject(Router);

  // Token 儲存名稱
  private readonly tokenStorageKey = 'portfolio_access_token';

  // 保存目前登入者
  private readonly currentUserSignal = signal<CurrentUser | null>(null);
  // 目前登入者狀態 對外提供唯讀 Signal
  readonly currentUser = this.currentUserSignal.asReadonly();

  // 是否已登入
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  // 是否具有 Writer 權限
  readonly isWriter = computed(() =>
    this.currentUserSignal()?.roles.includes('Writer') ?? false
  );

  private readonly authInitializedSignal = signal(false);
  readonly authInitialized = this.authInitializedSignal.asReadonly();

  private initializeAuthRequest: Observable<CurrentUser | null> | null = null;


  login(request: LoginRequest): Observable<CurrentUser> {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/api/auth/login`, request)
      .pipe(
        tap((response) => {this.saveToken(response.token)}),
        switchMap(() => this.getCurrentUser()),
        catchError((error) => {
          this.clearAuthentication();
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiBaseUrl}/api/auth/me`)
      .pipe(
        tap((currentUser) => {
          this.currentUserSignal.set(currentUser);
        })
      );
  }

  initializeAuth(): Observable<CurrentUser | null> {
    if (this.authInitializedSignal()) {
      return of(this.currentUserSignal());
    }

    if (this.initializeAuthRequest) {
      return this.initializeAuthRequest;
    }

    const token = this.getToken();

    if (!token) {
      this.currentUserSignal.set(null);
      this.authInitializedSignal.set(true);

      return of(null);
    }

    this.initializeAuthRequest = this.getCurrentUser().pipe(
      catchError(() => {
        this.clearAuthentication();
        return of(null);
      }),
      finalize(() => {
        this.authInitializedSignal.set(true);
        this.initializeAuthRequest = null;
      }),
      shareReplay(1)
    );

    return this.initializeAuthRequest;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenStorageKey);
  }

  logout(): void {
    this.clearAuthentication();
    this.router.navigate(['/']);
  }

  clearAuthentication(): void {
    sessionStorage.removeItem(this.tokenStorageKey);
    this.currentUserSignal.set(null);
  }

  private saveToken(token: string): void {
    sessionStorage.setItem(this.tokenStorageKey, token);
  }

}
