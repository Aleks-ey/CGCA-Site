import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: `./header.component.html`,
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {

  isMenuOpen: boolean = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
  // function that executes when the window is resized and closes the menu if the window is larger than 1024px
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 1024) {
      this.isMenuOpen = false;
    }
  }
}
