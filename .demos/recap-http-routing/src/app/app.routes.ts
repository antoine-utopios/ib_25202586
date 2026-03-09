import { Routes } from '@angular/router';
import { TestHttp } from './test-http/test-http';
// import { ADMIN_ROUTES } from './admin/admin.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'test', pathMatch: 'full' },
  { path: 'test', component: TestHttp },
  { path: 'truc-bidule', loadComponent: () => import('./trucbidule/trucbidule').then(c => c.Trucbidule) },
  // { path: 'admin', children: ADMIN_ROUTES },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(r => r.ADMIN_ROUTES) }
];
