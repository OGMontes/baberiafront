import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ServicioService, Servicio } from '../services/servicio.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cortes-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cortes-admin.component.html',
  styleUrls: ['./cortes-admin.component.scss']
})
export class CortesAdminComponent implements OnInit {
  servicios: Servicio[] = [];
  fotos: { [key: number]: { id: number; filename: string }[] } = {};
  fileInputs: { [key: number]: HTMLInputElement } = {};
  fotoBaseUrl = environment.cortesImgBaseUrl;
  timestamp = Date.now();

  // ✅ NUEVA constante con ruta API sin conflicto
  private apiFotosUrl = environment.apiFotosUrl;

  constructor(private servicioService: ServicioService, private http: HttpClient) {}

  ngOnInit(): void {
    this.servicioService.obtenerServicios().subscribe(data => {
      this.servicios = data;
      data.forEach(s => this.cargarFotos(s.ServicioId));
    });
  }

  setInputRef(input: HTMLInputElement, servicioId: number): boolean {
    this.fileInputs[servicioId] = input;
    return true;
  }

  cargarFotos(servicioId: number) {
    this.http.get<any[]>(`${this.apiFotosUrl}/${servicioId}`).subscribe(res => {
      this.fotos[servicioId] = res;
    });
  }

  subirFoto(servicioId: number, event: Event) {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('file', archivo);

    this.http.post(`${this.apiFotosUrl}/${servicioId}`, formData).subscribe({
      next: () => {
        this.cargarFotos(servicioId);
        this.timestamp = Date.now();
      },
      error: (err) => alert(err.error.detail || 'Error al subir')
    });
  }

  eliminarFoto(fotoId: number, servicioId: number) {
    if (!confirm('¿Eliminar esta foto?')) return;
    this.http.delete(`${this.apiFotosUrl}/${fotoId}`).subscribe(() => {
      this.cargarFotos(servicioId);
      this.timestamp = Date.now();
    });
  }
}
