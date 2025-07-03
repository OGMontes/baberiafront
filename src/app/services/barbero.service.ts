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
    return this.http.get<Barbero[]>(`${this.baseUrl}`);
  }

  obtenerBarberosPorServicio(servicioId: number): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.baseUrl}/por-servicio/${servicioId}`);
  }

  crearBarbero(barbero: Partial<Barbero>): Observable<Barbero> {
    return this.http.post<Barbero>(`${this.baseUrl}`, barbero);
  }

  actualizarBarbero(barberoId: number, barberoData: any): Observable<Barbero> {
    return this.http.put<Barbero>(`${this.baseUrl}/${barberoId}`, barberoData);
  }

  eliminarBarbero(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  obtenerServicios(): Observable<Servicio[]> {
    // Si quieres traer los servicios generales, probablemente esto debería estar en un ServicioService aparte.
    return this.http.get<Servicio[]>(`${environment.apiUrl}/servicios`);
  }

  subirFoto(barberoId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/subir-foto/${barberoId}`, formData);
  }
}
