import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BarberoService, Barbero } from '../services/barbero.service';
import { ServicioService, Servicio } from '../services/servicio.service';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent implements OnInit {
  barberos: Barbero[] = [];
  servicios: Servicio[] = [];

  cita = {
    nombre_cliente: '',
    correo: '',
    telefono: '',
    servicio_id: 0,
    barbero_id: 0,
    fecha_cita: '',
    comentarios: ''
  };

  constructor(
    private barberoService: BarberoService,
    private servicioService: ServicioService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    this.servicioService.obtenerServicios().subscribe((data) => {
      this.servicios = data;
    });
  }


  barberosFiltrados: Barbero[] = [];

onServicioSeleccionado() {
  if (this.cita.servicio_id) {
    this.barberoService.obtenerBarberosPorServicio(this.cita.servicio_id).subscribe({
      next: (barberos) => {
        this.barberos = barberos;
      },
      error: (err) => {
        console.error('Error al obtener barberos por servicio', err);
      }
    });
  }
}




  soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validarYEnviar(form: NgForm) {
    if (form.invalid) {
      alert('❗ Por favor completa todos los campos correctamente antes de continuar.');
      return;
    }

    const citaFormateada = {
      NombreCliente: this.cita.nombre_cliente,
      Correo: this.cita.correo,
      Telefono: this.cita.telefono,
      FechaCita: this.cita.fecha_cita,
      ServicioId: this.cita.servicio_id,
      BarberoId: this.cita.barbero_id,
      Comentarios: this.cita.comentarios
    };

    console.log("📤 Enviando al backend:", citaFormateada);

    this.citaService.crearCita(citaFormateada).subscribe({
      next: () => alert('✅ Cita reservada correctamente 🎉'),
      error: (err) => {
        console.error('Error al crear cita:', err);
        alert('❌ Ocurrió un error al reservar la cita.');
      }
    });
  }
}
