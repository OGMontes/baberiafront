import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuAbierto = false;
  activeSection = '';

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  navigateToHomeAndScroll(id?: string): void {
  this.activeSection = id || 'top';
  this.menuAbierto = false;

  const scrollToElement = () => {
    if (id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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


  isActive(section: string): boolean {
  return this.router.url === '/' && this.activeSection === section;
}


}
