import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Servicio {
  ServicioId: number;
  Nombre: string;
  Descripcion?: string;
  Precio: number;
  duracion_minutos: number;
  Activo: boolean;
  FotoCorte?: string;
}


@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = `${environment.apiUrl}/servicios`;

  constructor(private http: HttpClient) {}

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  crearServicio(servicio: Partial<Servicio>) {
  return this.http.post(this.apiUrl, servicio);
}
eliminarServicio(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
actualizarServicio(id: number, servicio: Partial<Servicio>) {
  return this.http.put(`${this.apiUrl}/${id}`, servicio);
}


}
