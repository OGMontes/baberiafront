import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService, CitaPayload, CitaResponse } from '../services/cita.service';
import { BarberoService } from '../services/barbero.service';
import { ServicioService } from '../services/servicio.service';

@Component({
  standalone: true,
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
  imports: [CommonModule, DatePipe, FormsModule],
})
export class CitasComponent implements OnInit {
  diasSemana: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  mesActual: Date = new Date();
  semanas: any[][] = [];
  citaSeleccionada: any = null;
  diaSeleccionado: any = null;


  barberos: { BarberoId: number; Nombre: string }[] = [];
  servicios: { ServicioId: number; Nombre: string }[] = [];

  citasPorFecha: { [fecha: string]: CitaResponse[] } = {};

  toastMensaje: string = '';
  mostrarToastActivo = false;

  constructor(
    private citaService: CitaService,
    private barberoService: BarberoService,
    private servicioService: ServicioService
  ) {}

  ngOnInit(): void {
    this.cargarBarberos();
    this.cargarServicios();
    this.cargarCitas();
  }

  cargarBarberos(): void {
    this.barberoService.obtenerBarberos().subscribe((barberos) => {
      this.barberos = barberos;
    });
  }

  cargarServicios(): void {
    this.servicioService.obtenerServicios().subscribe((servicios) => {
      this.servicios = servicios;
    });
  }

  cargarCitas(): void {
    this.citaService.obtenerCitas().subscribe((citas) => {
      this.citasPorFecha = {};
      citas.forEach((cita) => {
        const fechaObj = new Date(cita.FechaCita);
        const clave = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, '0')}-${String(fechaObj.getDate()).padStart(2, '0')}`;
        if (!this.citasPorFecha[clave]) {
          this.citasPorFecha[clave] = [];
        }
        this.citasPorFecha[clave].push(cita);
      });
      this.generarCalendario();
    });
  }

  generarCalendario(): void {
    const primerDiaMes = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const ultimoDiaMes = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0);
    const inicio = new Date(primerDiaMes);
    inicio.setDate(inicio.getDate() - (inicio.getDay() === 0 ? 6 : inicio.getDay() - 1));
    const fin = new Date(ultimoDiaMes);
    fin.setDate(fin.getDate() + (7 - (fin.getDay() === 0 ? 7 : fin.getDay())));

    const semanasTemp: any[][] = [];
    let semana: any[] = [];

    for (let dia = new Date(inicio); dia <= fin; dia.setDate(dia.getDate() + 1)) {
      const diaCopia = new Date(dia);
      const enMesActual = diaCopia.getMonth() === this.mesActual.getMonth();
      semana.push({
        fecha: new Date(diaCopia),
        enMesActual,
        citas: this.obtenerCitasDelDia(diaCopia),
      });
      if (semana.length === 7) {
        semanasTemp.push(semana);
        semana = [];
      }
    }

    this.semanas = semanasTemp;
  }

  abrirModalCitasDia(dia: any): void {
  this.diaSeleccionado = dia;
}

cerrarModalDia(): void {
  this.diaSeleccionado = null;
}


  obtenerCitasDelDia(fecha: Date): CitaResponse[] {
    const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    return this.citasPorFecha[clave] || [];
  }

  esHoy(fecha: Date): boolean {
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  }

  abrirModal(cita: CitaResponse, evento?: MouseEvent): void {
    if (evento) evento.stopPropagation();
    const hora = new Date(cita.FechaCita).toTimeString().slice(0, 5);
    this.citaSeleccionada = {
      ...cita,
      hora,
      fecha: new Date(cita.FechaCita),
    };
  }

  abrirDia(dia: any): void {
    if (dia.citas.length === 0 && this.servicios.length && this.barberos.length) {
      this.citaSeleccionada = {
        NombreCliente: '',
        Correo: '',
        Telefono: '',
        ServicioId: this.servicios[0].ServicioId,
        BarberoId: this.barberos[0].BarberoId,
        Comentarios: '',
        fecha: dia.fecha,
        hora: '',
        Estado: 'Pendiente',
      };
    }
  }

  cerrarModal(): void {
    this.citaSeleccionada = null;
  }

  guardarCita(): void {
    if (!this.citaSeleccionada) return;

    const fechaISO = this.formatearFechaCita(this.citaSeleccionada.fecha, this.citaSeleccionada.hora);

    if (this.citaSeleccionada.CitaId) {
      // Reprogramar
      this.citaService.actualizarCita(this.citaSeleccionada.CitaId, {
        FechaCita: fechaISO,
        BarberoId: this.citaSeleccionada.BarberoId,
        ServicioId: this.citaSeleccionada.ServicioId,
        Comentarios: this.citaSeleccionada.Comentarios,
      }).subscribe(() => {
        this.mostrarToast('Cita reprogramada correctamente');
        this.cerrarModal();
        this.cargarCitas();
      });
    } else {
      // Nueva cita
      const nuevaCita: CitaPayload = {
        NombreCliente: this.citaSeleccionada.NombreCliente,
        Correo: this.citaSeleccionada.Correo,
        Telefono: this.citaSeleccionada.Telefono,
        FechaCita: fechaISO,
        ServicioId: this.citaSeleccionada.ServicioId,
        BarberoId: this.citaSeleccionada.BarberoId,
        Comentarios: this.citaSeleccionada.Comentarios,
      };
      this.citaService.crearCita(nuevaCita).subscribe(() => {
        this.mostrarToast('Cita guardada correctamente');
        this.cerrarModal();
        this.cargarCitas();
      });
    }
  }

  cancelarCita(): void {
    if (!this.citaSeleccionada?.CitaId) return;
    this.citaService.actualizarCita(this.citaSeleccionada.CitaId, {
      Estado: 'Cancelada',
    }).subscribe(() => {
      this.mostrarToast('Cita cancelada correctamente');
      this.cerrarModal();
      this.cargarCitas();
    });
  }

  confirmarCita(): void {
    if (!this.citaSeleccionada?.CitaId) return;
    this.citaService.actualizarCita(this.citaSeleccionada.CitaId, {
      Estado: 'Confirmada',
    }).subscribe(() => {
      this.mostrarToast('Cita confirmada correctamente');
      this.cerrarModal();
      this.cargarCitas();
    });
  }

  formatearFechaCita(fecha: Date, hora: string): string {
    const [hh, mm] = hora.split(':');
    const cita = new Date(fecha);
    cita.setHours(+hh, +mm, 0);
    return cita.toISOString();
  }

  getNombreServicio(id: number): string {
    const servicio = this.servicios.find(s => s.ServicioId === id);
    return servicio ? servicio.Nombre : '—';
  }

  getNombreBarbero(id: number): string {
    const barbero = this.barberos.find(b => b.BarberoId === id);
    return barbero ? barbero.Nombre : '—';
  }

  mostrarToast(mensaje: string): void {
    this.toastMensaje = mensaje;
    this.mostrarToastActivo = true;
    setTimeout(() => {
      this.mostrarToastActivo = false;
      this.toastMensaje = '';
    }, 3000);
  }

  mesAnterior(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1);
    this.generarCalendario();
  }

  mesSiguiente(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1);
    this.generarCalendario();
  }
  confirmarCitaDesdeLista(cita: CitaResponse): void {
  this.citaService.actualizarCita(cita.CitaId, {
    Estado: 'Confirmada'
  }).subscribe(() => {
    cita.Estado = 'Confirmada'; // ✅ Forzar actualización visual
    this.mostrarToast('Cita confirmada correctamente');
  });
}
guardarCitaEditada(cita: any) {
  // Aquí puedes hacer la llamada a tu servicio si quieres actualizar en backend
  // Por ahora simula:
  console.log('Cita actualizada:', cita);
  cita.editando = false;
}

cancelarCitaDesdeLista(cita: CitaResponse): void {
  this.citaService.actualizarCita(cita.CitaId, {
    Estado: 'Cancelada'
  }).subscribe(() => {
    cita.Estado = 'Cancelada'; // ✅ Forzar actualización visual
    this.mostrarToast('Cita cancelada correctamente');
  });
}

}
