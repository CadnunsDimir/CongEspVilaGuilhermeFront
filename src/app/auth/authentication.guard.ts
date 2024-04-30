import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";


export function authenticationGuard(): CanActivateFn {
  return () => {
    console.log("authenticationGuard");
    const oauthService = inject(AuthService);
    if (oauthService.hasAccess()) {
      return true;
    }
    oauthService.requestUserLogin();
    return false;
  };
}
