import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.initializeAuth().pipe(
    map(() => {
      if (authService.isWriter()) {
        return true;
      }

      return router.createUrlTree(
        ['/log_in'],
        {
          queryParams: {
            returnUrl: state.url,
          },
        }
      );
    })
  );
};
