import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./pages/task-dashboard/task-dashboard').then((module) => module.TaskDashboard),
  },
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: '**', redirectTo: 'tasks' },
];
