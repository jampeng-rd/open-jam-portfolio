import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth-service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  const isLoginRequest = request.url.endsWith('/api/auth/login');

  const authenticatedRequest = token
  ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token && !isLoginRequest) {
        const returnUrl = router.url;

        authService.clearAuthentication();

        router.navigate(['/log_in'], {
          queryParams: {
            returnUrl: returnUrl
          },
        });
      }

      if (error.status === 403) {
        router.navigate(['/forbidden']);
      }

      return throwError(() => error);
    })
  );
};