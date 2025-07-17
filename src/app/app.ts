import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgIf],
  templateUrl: './app.html'
})
export class App {
  // Signal que controla visibilidad de navbar y footer
  mostrarNavbar = signal(true);

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Deshabilita navbar/footer si la ruta empieza con /admin
      const esAdmin = event.urlAfterRedirects.startsWith('/admin');
      this.mostrarNavbar.set(!esAdmin);
    });
  }
}
