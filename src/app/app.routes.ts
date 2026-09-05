import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

import { LandingPageComponent } from './features/landing/landing-page.component';
import { MyBlogsPageComponent } from './features/my-blogs/my-blogs-page.component';

const requireAuthentication = async (
  _: ActivatedRouteSnapshot,
  __: RouterStateSnapshot,
  authData: AuthGuardData,
): Promise<boolean | UrlTree> => {
  if (authData.authenticated) {
    return true;
  }

  return inject(Router).parseUrl('/');
};

const authGuard = createAuthGuard<CanActivateFn>(requireAuthentication);

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'my-blogs',
    component: MyBlogsPageComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
