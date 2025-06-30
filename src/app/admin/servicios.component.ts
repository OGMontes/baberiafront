import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="seccion-titulo">Servicios</h2>
    <div class="acciones">
      <button class="btn minimal">＋ Agregar</button>
      <button class="btn minimal">✏️ Editar</button>
      <button class="btn minimal danger">🗑️ Eliminar</button>
    </div>
  `,
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent {}
