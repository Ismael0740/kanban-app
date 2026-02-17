import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/kanban/kanban').then(m => m.Kanban) },
  { path: '**', redirectTo: '' }
];
