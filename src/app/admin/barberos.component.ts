import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barberos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="seccion-titulo">Barberos</h2>
<div class="acciones">
  <button class="btn minimal">＋ Agregar</button>
  <button class="btn minimal">✏️ Editar</button>
  <button class="btn minimal danger">🗑️ Eliminar</button>
</div>

  `,
  styleUrls: ['./barberos.component.scss']
})
export class BarberosComponent {}
