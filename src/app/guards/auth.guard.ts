// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles, keycloak } = authData;

  if (!authenticated) {
    await keycloak.login({
      redirectUri: window.location.origin + state.url,
    });
    return false;
  }

  const requiredRole = route.data['role'] as string | undefined;
  if (!requiredRole) {
    return true;
  }

  const hasRole = Object.values(grantedRoles.resourceRoles).some((roles) =>
    roles.includes(requiredRole)
  );

  return hasRole ? true : inject(Router).parseUrl('/forbidden');
};

export const canActivateAuthRole =
  createAuthGuard<CanActivateFn>(isAccessAllowed);