import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { NotificationsService } from "../services/notifications/notifications.service";

export function adminGuard(): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const notifications = inject(NotificationsService);

    if (!auth.hasAccess()) {
      auth.requestUserLogin();
      return false;
    }

    if (auth.isAdmin()) {
      return true;
    }

    notifications.send({
      type: 'error',
      message: 'Acesso permitido apenas para administradores.'
    });

    return router.createUrlTree(['/home']);
  };
}
