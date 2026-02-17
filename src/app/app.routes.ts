import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.Register), canActivate: [guestGuard] },
  { path: '', loadComponent: () => import('./components/lista-kanbans/lista-kanbans').then(m => m.ListaKanbans), canActivate: [authGuard] },
  { path: 'board/:id', loadComponent: () => import('./components/kanban/kanban').then(m => m.Kanban), canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
