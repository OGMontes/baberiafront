import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicioService, Servicio } from '../services/servicio.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  mostrarModal = false;
  servicioSeleccionado: Servicio | null = null;
  confirmarEliminar = false;
  modoEditar = false;
  mostrarToast = false;
  mensajeToast = '';

  nuevoServicio: Partial<Servicio> = {
    Nombre: '',
    duracion_minutos: 0,
    Precio: 0,
    Descripcion: ''
  };

  constructor(private servicioService: ServicioService) {}

  ngOnInit(): void {
    this.servicioService.obtenerServicios().subscribe({
      next: (data: Servicio[]) => {
        this.servicios = data;
      },
      error: (err: any) => {
        console.error('Error cargando servicios:', err);
      }
    });
  }

  abrirModal() {
    this.modoEditar = false;
    this.mostrarModal = true;
    this.nuevoServicio = {
      Nombre: '',
      duracion_minutos: 0,
      Precio: 0,
      Descripcion: ''
    };
  }

  editarServicio() {
    if (!this.servicioSeleccionado) return;
    this.modoEditar = true;
    this.mostrarModal = true;
    this.nuevoServicio = { ...this.servicioSeleccionado };
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarServicio() {
    if (this.modoEditar && this.servicioSeleccionado) {
      this.servicioService.actualizarServicio(this.servicioSeleccionado.ServicioId, this.nuevoServicio).subscribe({
        next: () => {
          this.mostrarNotificacion('Servicio actualizado');
          this.cerrarModal();
          this.ngOnInit();
        },
        error: err => {
          alert('Error al actualizar el servicio');
          console.error(err);
        }
      });
    } else {
      this.servicioService.crearServicio(this.nuevoServicio).subscribe({
        next: () => {
          this.mostrarNotificacion('Servicio agregado exitosamente');
          this.cerrarModal();
          this.ngOnInit();
        },
        error: err => {
          alert('Error al guardar el servicio');
          console.error(err);
        }
      });
    }
  }

  seleccionarServicio(servicio: Servicio) {
    this.servicioSeleccionado = servicio;
  }

  abrirConfirmacionEliminar() {
    if (this.servicioSeleccionado) {
      this.confirmarEliminar = true;
    }
  }

  cancelarEliminacion() {
    this.confirmarEliminar = false;
  }

  confirmarEliminacion() {
    if (!this.servicioSeleccionado) return;

    this.servicioService.eliminarServicio(this.servicioSeleccionado.ServicioId).subscribe({
      next: () => {
        this.mostrarNotificacion('Servicio eliminado');
        this.confirmarEliminar = false;
        this.servicioSeleccionado = null;
        this.ngOnInit();
      },
      error: (err) => {
        alert('Error al eliminar el servicio');
        console.error(err);
      }
    });
  }

  mostrarNotificacion(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    setTimeout(() => {
      this.mostrarToast = false;
    }, 3000);
  }
}
