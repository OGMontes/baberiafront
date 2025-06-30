import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servicio {
  ServicioId: number;
  Nombre: string;
  Descripcion?: string;
  Precio: number;
  duracion_minutos: number;
  Activo: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:8000/servicios';

  constructor(private http: HttpClient) {}

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }
}
