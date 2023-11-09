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

  isCommunityDropdownOpen = false;
  toggleCommunityDropdown() {
    this.isCommunityDropdownOpen = !this.isCommunityDropdownOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.isCommunityDropdownOpen = false;
  }
  // function that executes when the window is resized and closes the menu if the window is larger than 1024px
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 1024) {
      this.isMenuOpen = false;
    }
  }

  // ------------------ Dropdown ------------------
  showDropdown: boolean = false;
  private timeout: string | number | NodeJS.Timeout | undefined;

  onButtonMouseOver() {
    this.showDropdown = true;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onButtonMouseOut() {
    this.timeout = setTimeout(() => {
      this.showDropdown = false;
    }, 50); // A delay of 200ms, adjust as necessary
  }

  onDropdownMouseOver() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onDropdownMouseOut() {
    this.timeout = setTimeout(() => {
      this.showDropdown = false;
    }, 50); // A delay of 200ms, adjust as necessary
  }
}
