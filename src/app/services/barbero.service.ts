import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  Activo?: boolean;
  FechaIngreso?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BarberoService {
  private baseUrl = `${environment.apiUrl}/barberos`;

  constructor(private http: HttpClient) {}

  obtenerBarberos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.baseUrl}/barberos`);
  }

  obtenerBarberosPorServicio(servicioId: number): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.baseUrl}/barberos/por-servicio/${servicioId}`);
  }

  crearBarbero(barbero: Partial<Barbero>): Observable<Barbero> {
    return this.http.post<Barbero>(`${this.baseUrl}/barberos`, barbero);
  }

  actualizarBarbero(barberoId: number, barberoData: any): Observable<Barbero> {
    return this.http.put<Barbero>(`${this.baseUrl}/barberos/${barberoId}`, barberoData);
  }

  eliminarBarbero(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/barberos/${id}`);
  }

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.baseUrl}/servicios`);
  }

  subirFoto(barberoId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/barberos/subir-foto/${barberoId}`, formData);
  }
}
