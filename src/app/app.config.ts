import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appConfiguration } from './core/config/app-config';
import { routes } from './app.routes';
import {
  provideKeycloak,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  includeBearerTokenInterceptor,
} from 'keycloak-angular';

const apiUrl = new URL(appConfiguration.apiBaseUrl);
const apiOriginPattern = apiUrl.origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const apiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: new RegExp(`^${apiOriginPattern}(\/.*)?$`, 'i'),
  bearerPrefix: 'Bearer',
});


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([includeBearerTokenInterceptor])
    ),

    provideKeycloak({
      config: {
        url: appConfiguration.keycloak.url,
        realm: appConfiguration.keycloak.realm,
        clientId: appConfiguration.keycloak.clientId,
      },
      initOptions: {
        onLoad: appConfiguration.keycloak.onLoad,
        pkceMethod: appConfiguration.keycloak.pkceMethod,
        checkLoginIframe: appConfiguration.keycloak.checkLoginIframe,
        silentCheckSsoRedirectUri:
          `${window.location.origin}${appConfiguration.keycloak.silentCheckSsoPath}`,
      },
      features: [
        withAutoRefreshToken({
          onInactivityTimeout: 'logout',
          sessionTimeout: appConfiguration.keycloak.inactivityTimeout,
        }),
      ],
      providers: [
        AutoRefreshTokenService,
        UserActivityService,
      ],
    }),

    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [apiCondition],
    },
  ],
};