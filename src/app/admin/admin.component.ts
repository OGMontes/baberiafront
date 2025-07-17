import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberosComponent } from './barberos.component';
import { ServiciosComponent } from './servicios.component';
import { CitasComponent } from './citas.component';
import { NotificacionesComponent } from './notificaciones.component';
import { CortesAdminComponent } from './cortes-admin.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, BarberosComponent, ServiciosComponent, CitasComponent, NotificacionesComponent, CortesAdminComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  seccion: string = 'barberos'; // Sección por defecto
}
