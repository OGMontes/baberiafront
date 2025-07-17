// src/app/services/cortes.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ── Forma bruta en que tu API /servicios devuelve cada servicio ───────────
interface RawServicio {
  ServicioId: number;
  Nombre: string;
  Descripcion: string;
}

// ── Nuestro tipo limpio para los componentes ───────────────────────────────
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class CortesService {
  /** Lista servicios sin fotos */
  private svcUrl   = `${environment.apiUrl}/servicios`;
  /** Endpoint que devuelve [{id, filename}, …] */
  private fotosUrl = `${environment.apiUrl}/api-fotos-servicio`;

  constructor(private http: HttpClient) {}

  /**
   * Devuelve [{id,nombre,descripcion}]
   */
  getServicios(): Observable<Servicio[]> {
    return this.http.get<RawServicio[]>(this.svcUrl).pipe(
      map(list =>
        list.map(s => ({
          id:          s.ServicioId,
          nombre:      s.Nombre,
          descripcion: s.Descripcion
        }))
      )
    );
  }

  /**
   * Devuelve sólo el array de nombres de archivo (string[]) para un servicio
   */
  getFotos(servicioId: number): Observable<string[]> {
    return this.http
      .get<{ id: number; filename: string }[]>(`${this.fotosUrl}/${servicioId}`)
      .pipe(
        map(arr => arr.map(f => f.filename))
      );
  }
}
