import { effect, inject, Injectable, signal } from '@angular/core';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';
import Keycloak from 'keycloak-js';

import { appConfiguration } from '../config/app-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakEventSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  readonly isAuthenticated = signal(this.keycloak.authenticated ?? false);

  constructor() {
    effect(() => {
      const event = this.keycloakEventSignal();

      if (event.type === KeycloakEventType.Ready) {
        this.isAuthenticated.set(typeEventArgs<ReadyArgs>(event.args));
      } else if (event.type === KeycloakEventType.AuthSuccess) {
        this.isAuthenticated.set(true);
      } else if (event.type === KeycloakEventType.AuthLogout) {
        this.isAuthenticated.set(false);
      }
    });
  }

  login(): void {
    void this.keycloak.login({ redirectUri: this.redirectUri });
  }

  register(): void {
    void this.keycloak.register({ redirectUri: this.redirectUri });
  }

  logout(): void {
    void this.keycloak.logout({ redirectUri: this.redirectUri });
  }

  private get redirectUri(): string {
    return `${window.location.origin}${appConfiguration.keycloak.redirectPath}`;
  }
}
