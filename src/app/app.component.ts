import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="isDesktop || isTablet || isMobile" class="h-max">
      <app-header></app-header>
      <router-outlet></router-outlet>
      <app-scroll-to-top></app-scroll-to-top>
      <app-footer></app-footer>
    </div>

    <!-- <div *ngIf="isMobile">
      <mat-sidenav-container fullscreen class="mobile_home_container">
        <mat-sidenav #sidenav mode="side" 
        [(opened)]="opened" 
        (opened)="events.push('open!')" 
        (closed)="events.push('close!')"
        class="sidenav_container">
          <div class="w-32">
            <a routerLink="/" class="logo">
              <img src="assets/images/CGCA-LOGO.png" alt="CGCA Logo">
            </a>
          </div>
          <div class="sidenav_links">
            
            <a routerLink="/" class="header_link">Home</a>
            <a routerLink="/mission" class="header_link">Our Mission</a>
            <a routerLink="/meet" class="header_link">Meet the Board</a>
            <a routerLink="/events" class="header_link">Events</a>
            <a routerLink="/contact" class="header_link">Contact</a>
          </div>
        </mat-sidenav>
      
        <mat-sidenav-content>
          <button mat-button class="hamburger" (click)="sidenav.toggle()">
            <mat-icon id="hamburger-icon">menu</mat-icon>
          </button>
      
          <router-outlet></router-outlet>
          <app-footer></app-footer>
        </mat-sidenav-content>
        
      </mat-sidenav-container> 
    </div> -->
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Georgian-Website';

  events: string[] = [];
  opened: boolean | undefined;

  constructor(private deviceService: DeviceDetectorService) {}

  isMobile = this.deviceService.isMobile();
  isTablet = this.deviceService.isTablet();
  isDesktop = this.deviceService.isDesktop();
}
