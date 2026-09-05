export interface AppConfig {
  apiBaseUrl: string;
  apiPaths: {
    blogs: string;
    myBlogs: string;
  };
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
    onLoad: 'check-sso' | 'login-required';
    pkceMethod: 'S256';
    checkLoginIframe: boolean;
    silentCheckSsoPath: string;
    redirectPath: string;
    inactivityTimeout: number;
  };
}

export const appConfiguration: AppConfig = {
  apiBaseUrl: 'https://localhost:7084/',
  apiPaths: {
    blogs: 'api/Blogs',
    myBlogs: 'api/Blogs/my',
  },
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'bloggy',
    clientId: 'angular-client',
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
    silentCheckSsoPath: '/silent-check-sso.html',
    redirectPath: '/',
    inactivityTimeout: 300000,
  },
};
