import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  activeSection: string = '';
  menuAbierto: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects !== '/') {
        this.activeSection = '';
      }
      this.menuAbierto = false; // 🔒 Cierra menú tras navegación
    });
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  navigateToHomeAndScroll(id?: string) {
    this.activeSection = id || 'top';
    this.menuAbierto = false;

    const scrollToElement = () => {
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(scrollToElement, 100);
      });
    } else {
      scrollToElement();
    }
  }
}
