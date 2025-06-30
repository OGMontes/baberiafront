import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servicio {
  ServicioId: number;
  Nombre: string;
  Precio: number;
  Descripcion?: string;
}

export interface Barbero {
  BarberoId: number;
  Nombre: string;
  Especialidad?: string;
  FotoUrl: string;
  servicios?: Servicio[];
}

@Injectable({
  providedIn: 'root'
})
export class BarberoService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  obtenerBarberos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.baseUrl}/barberos`);
  }

  obtenerBarberosPorServicio(servicioId: number): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.baseUrl}/barberos/por-servicio/${servicioId}`);
  }
}
