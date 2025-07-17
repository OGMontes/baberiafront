import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgStyle, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BarberoService, Barbero } from '../services/barbero.service';

interface Servicio {
  ServicioId: number;
  Nombre: string;
  Descripcion?: string;
  Precio: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgStyle, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentImageIndex = 0;
  imageList = [
    'assets/home/barberia-fondo.jpg',
    'assets/home/barbero1.jpg',
    'assets/home/barbero2.jpg'
  ];

  servicios: Servicio[] = [];
  servicioActivo: number | null = null;
  barberosPorServicio: { [key: number]: Barbero[] } = {};
fotoBaseUrl = environment.barberosImgBaseUrl;

  constructor(private barberoService: BarberoService, private http: HttpClient) {}

  get currentImage(): string {
    return this.imageList[this.currentImageIndex];
  }

  imagenEnTransicion = false;

ngOnInit(): void {
  this.cargarServicios();
  this.cambiarFondoConFade();
}

cambiarFondoConFade() {
  setInterval(() => {
    this.imagenEnTransicion = true;

    setTimeout(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imageList.length;
      this.imagenEnTransicion = false;
    }, 1000); // coincide con CSS (1s)
  }, 5000);
}


  cargarServicios() {
    this.http.get<Servicio[]>(`${environment.apiUrl}/servicios`).subscribe(data => {
  this.servicios = data;
});
  }

  toggleServicio(servicioId: number) {
  const mismoServicio = this.servicioActivo === servicioId;
  this.servicioActivo = mismoServicio ? null : servicioId;

  if (!mismoServicio && !this.barberosPorServicio[servicioId]) {
    this.barberoService.obtenerBarberosPorServicio(servicioId).subscribe((barberos: Barbero[]) => {
      this.barberosPorServicio[servicioId] = barberos;
      // Espera a que se renderice el DOM
      setTimeout(() => this.scrollToServicio(servicioId), 200);
    });
  } else if (!mismoServicio) {
    setTimeout(() => this.scrollToServicio(servicioId), 200);
  }
}


scrollToServicio(servicioId: number) {
  const el = document.getElementById('servicio-' + servicioId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

}
