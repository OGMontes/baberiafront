import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="seccion-titulo">Citas</h2>
    <div class="acciones">
      <button class="btn minimal">＋ Nueva</button>
      <button class="btn minimal">✏️ Editar</button>
      <button class="btn minimal danger">🗑️ Cancelar</button>
    </div>
  `,
  styleUrls: ['./citas.component.scss']
})
export class CitasComponent {}
