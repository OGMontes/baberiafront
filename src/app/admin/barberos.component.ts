import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberoService, Barbero, Servicio } from '../services/barbero.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-barberos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barberos.component.html',
  styleUrls: ['./barberos.component.scss']
})
export class BarberosComponent implements OnInit {
  barberos: Barbero[] = [];
  servicios: Servicio[] = [];
  barberoSeleccionado: Barbero | null = null;
  mostrarModal = false;
  confirmarEliminar = false;
  mostrarToast = false;
  mensajeToast = '';
  modoEditar = false;

  @ViewChild('inputArchivo') inputArchivoRef!: ElementRef<HTMLInputElement>;

  timestamp = Date.now();
  fotoBaseUrl = environment.apiUrl + '/barberos-img/';

  nuevoBarbero: any = {
    Nombre: '',
    FotoUrl: '',
    serviciosIds: []
  };

  constructor(private barberoService: BarberoService) {}

  ngOnInit(): void {
    this.barberoService.obtenerBarberos().subscribe({
      next: (data) => this.barberos = data
    });

    this.barberoService.obtenerServicios().subscribe({
      next: (data) => this.servicios = data
    });
  }

  abrirModal() {
    this.modoEditar = false;
    this.mostrarModal = true;
    this.nuevoBarbero = { Nombre: '', FotoUrl: '', serviciosIds: [] };
  }

  editarBarbero() {
    if (!this.barberoSeleccionado) return;
    this.modoEditar = true;
    this.mostrarModal = true;
    this.nuevoBarbero = {
      Nombre: this.barberoSeleccionado.Nombre,
      FotoUrl: this.barberoSeleccionado.FotoUrl,
      serviciosIds: this.barberoSeleccionado.servicios?.map(s => s.ServicioId) || []
    };
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  mostrarNotificacion(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    setTimeout(() => this.mostrarToast = false, 3000);
  }

  guardarBarbero() {
    if (this.modoEditar && this.barberoSeleccionado) {
      this.barberoService.actualizarBarbero(this.barberoSeleccionado.BarberoId, this.nuevoBarbero).subscribe({
        next: () => {
          this.mostrarNotificacion('Barbero actualizado');
          this.cerrarModal();
          this.ngOnInit();
        }
      });
    } else {
      this.barberoService.crearBarbero(this.nuevoBarbero).subscribe({
        next: () => {
          this.mostrarNotificacion('Barbero agregado');
          this.cerrarModal();
          this.ngOnInit();
        }
      });
    }
  }

  seleccionarBarbero(barbero: Barbero) {
    this.barberoSeleccionado = barbero;
  }

  abrirConfirmacionEliminar() {
    this.confirmarEliminar = true;
  }

  cancelarEliminacion() {
    this.confirmarEliminar = false;
  }

  confirmarEliminacion() {
    if (!this.barberoSeleccionado) return;
    this.barberoService.eliminarBarbero(this.barberoSeleccionado.BarberoId).subscribe({
      next: () => {
        this.mostrarNotificacion('Barbero eliminado');
        this.confirmarEliminar = false;
        this.barberoSeleccionado = null;
        this.ngOnInit();
      }
    });
  }

  subirFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.barberoSeleccionado) {
      const archivo = input.files[0];
      const formData = new FormData();
      formData.append('file', archivo);

      this.barberoService.subirFoto(this.barberoSeleccionado.BarberoId, formData).subscribe({
        next: (updatedBarbero) => {
          this.barberos = this.barberos.map(b =>
            b.BarberoId === updatedBarbero.BarberoId ? updatedBarbero : b
          );
          this.barberoSeleccionado = updatedBarbero;
          this.timestamp = Date.now();
          this.mostrarNotificacion('Foto actualizada');
          this.inputArchivoRef.nativeElement.value = '';
        }
      });
    }
  }

  toggleServicio(servicioId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const index = this.nuevoBarbero.serviciosIds.indexOf(servicioId);
    if (checked && index === -1) {
      this.nuevoBarbero.serviciosIds.push(servicioId);
    } else if (!checked && index !== -1) {
      this.nuevoBarbero.serviciosIds.splice(index, 1);
    }
  }
}
