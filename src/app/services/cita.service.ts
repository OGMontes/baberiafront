import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CitaPayload {
  NombreCliente: string;
  Correo: string;
  Telefono: string;
  FechaCita: string; // ISO format
  ServicioId: number;
  BarberoId: number;
  Comentarios: string;
}

export interface CitaResponse extends CitaPayload {
  CitaId: number;
  Estado: string;
  FechaSolicitud: string;
}

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private apiUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {}

  crearCita(cita: CitaPayload): Observable<CitaResponse> {
    return this.http.post<CitaResponse>(`${this.apiUrl}/`, cita);
  }

  obtenerCitas(): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(this.apiUrl);
  }

  actualizarCita(id: number, cambios: any): Observable<CitaResponse> {
  return this.http.put<CitaResponse>(`${this.apiUrl}/${id}`, cambios);
}

  eliminarCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
