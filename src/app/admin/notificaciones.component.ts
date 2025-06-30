import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="seccion-titulo">Notificaciones</h2>
    <div class="acciones">
      <button class="btn minimal">📤 Enviar</button>
      <button class="btn minimal">⏰ Programar</button>
      <button class="btn minimal danger">🚫 Detener</button>
    </div>
  `,
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent {}
