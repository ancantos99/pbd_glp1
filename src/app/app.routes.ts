import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Intake } from './pages/intake/intake';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: Landing },
  { path: 'intake', component: Intake }
];
