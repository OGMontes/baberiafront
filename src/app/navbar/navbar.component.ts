import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  activeSection: string = '';

  constructor(private router: Router) {}

  navigateToHomeAndScroll(id?: string) {
    this.activeSection = id || 'top';

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
