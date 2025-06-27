import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  currentImageIndex = 0;
  imageList = [
    'assets/home/barberia-fondo.jpg',
    'assets/home/barbero1.jpg',
    'assets/home/barbero2.jpg'
  ];

  get currentImage(): string {
    return this.imageList[this.currentImageIndex];
  }

  ngOnInit() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imageList.length;
    }, 4000); // cambia cada 4s
  }
  
}
