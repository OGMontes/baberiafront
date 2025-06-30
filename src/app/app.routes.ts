import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CitaComponent } from './cita/cita.component';
import { AvisoComponent } from './aviso/aviso.component';
import { TerminosComponent } from './terminos/terminos.component';
import { ContactoComponent } from './contacto/contacto.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cita', component: CitaComponent },
  { path: 'aviso', component: AvisoComponent },
  { path: 'terminos', component: TerminosComponent },
  { path: 'contacto', component: ContactoComponent },
// 🚀 NUEVO: Ruta al panel admin
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then(m => m.AdminComponent)
  }
];