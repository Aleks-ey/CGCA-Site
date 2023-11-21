import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/supabase.service';

@Component({
  selector: 'app-header',
  templateUrl: `./header.component.html`,
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

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

  // ------------------ MyAccount Navigation ------------------
  async navigateToAccount() {
    await this.supabaseService.isLoggedIn() 
    .then (res => {
      if (res === true) {
        this.router.navigate(['/account']);
      } else {
        this.router.navigate(['/account-login']);
      }
    });
  }
}
