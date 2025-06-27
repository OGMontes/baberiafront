import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CitaComponent } from './cita/cita.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cita', component: CitaComponent },
];
