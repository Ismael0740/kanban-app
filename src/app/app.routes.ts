import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/lista-kanbans/lista-kanbans').then(m => m.ListaKanbans) },
  { path: 'board/:id', loadComponent: () => import('./components/kanban/kanban').then(m => m.Kanban) },
  { path: '**', redirectTo: '' }
];
