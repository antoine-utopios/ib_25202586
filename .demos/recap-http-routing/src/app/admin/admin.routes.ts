import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Blabla } from './blabla/blabla';
import { About } from './about/about';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'blabla', component: Blabla },
  { path: 'about', component: About }
]