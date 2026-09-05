import { Routes } from '@angular/router';

import { LandingPageComponent } from './features/landing/landing-page.component';
import { MyBlogsPageComponent } from './features/my-blogs/my-blogs-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'my-blogs',
    component: MyBlogsPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
