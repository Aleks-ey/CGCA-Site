import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="isDesktop || isTablet">
      <app-header></app-header>
      <router-outlet></router-outlet>
      <app-scroll-to-top></app-scroll-to-top>
      <app-footer></app-footer>
    </div>

    <div *ngIf="isMobile">
      <mat-sidenav-container fullscreen class="mobile-home-container">
        <mat-sidenav #sidenav mode="side" [(opened)]="opened" (opened)="events.push('open!')" (closed)="events.push('close!')">
          <div class="sidenav-links">
            <a routerLink="/" class="logo">
              <img src="/favicon.ico" alt=" ">
            </a>
            <a routerLink="/" class="header-link">Home</a>
            <a routerLink="/about" class="header-link">About Us</a>
            <a routerLink="/members" class="header-link">Members</a>
            <a routerLink="/events" class="header-link">Events</a>
            <a routerLink="/contact" class="header-link">Contact</a>
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
    </div>
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
