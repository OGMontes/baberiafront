import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CitaPayload {
  NombreCliente: string;
  Correo: string;
  Telefono: string;
  FechaCita: string;
  ServicioId: number;
  BarberoId: number;
  Comentarios: string;
}


@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:8000/citas';

  constructor(private http: HttpClient) {}

  crearCita(cita: CitaPayload) {
  return this.http.post('http://localhost:8000/citas/', cita);
}

}
