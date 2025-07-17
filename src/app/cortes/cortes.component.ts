// src/app/cortes/cortes.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { HttpClientModule }              from '@angular/common/http';

import { CortesService, Servicio }       from '../services/cortes.service';
import { environment }                   from '../../environments/environment';

interface ServicioConFotos extends Servicio {
  fotos: string[];
  current: number;
  fading: boolean;
}

@Component({
  selector: 'app-cortes',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cortes.component.html',
  styleUrls: ['./cortes.component.scss']
})
export class CortesComponent implements OnInit, OnDestroy {
  servicios: ServicioConFotos[] = [];
  baseUrl = environment.cortesImgBaseUrl;
  private intervalId!: number;

  // Duraciones en milisegundos
  private fadeDuration = 1000;     // 1s para el fade‑out / fade‑in
  private visibleDuration = 6000;  // 6s con la imagen fully visible

  constructor(private cortesService: CortesService) {}

  ngOnInit(): void {
    // 1) Cargo servicios y los inicializo
    this.cortesService.getServicios()
      .subscribe((list: Servicio[]) => {
        this.servicios = list.map((s: Servicio) => ({
          ...s,
          fotos: [],
          current: 0,
          fading: false
        }));

        // 2) Para cada servicio pido sus fotos
        this.servicios.forEach((s: ServicioConFotos) => {
          this.cortesService.getFotos(s.id)
            .subscribe((arr: string[]) => {
              s.fotos = arr;
            });
        });

        // 3) Arranco el ciclo completo: fade + visible
        this.intervalId = window.setInterval(() => {
          this.servicios.forEach(s => this.cycleFoto(s));
        }, this.visibleDuration + this.fadeDuration);
      });
  }

  private cycleFoto(s: ServicioConFotos) {
    if (s.fotos.length < 2) return;
    // Fade‑out
    s.fading = true;
    // Tras el fade‑out, cambio foto y hago fade‑in
    setTimeout(() => {
      s.current = (s.current + 1) % s.fotos.length;
      s.fading = false;
    }, this.fadeDuration);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
