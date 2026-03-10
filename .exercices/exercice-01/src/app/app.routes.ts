import { Routes } from '@angular/router';
import { BowlingComponent } from './bowling/bowling';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'bowling' },
  { path: 'bowling', component: BowlingComponent }
];
