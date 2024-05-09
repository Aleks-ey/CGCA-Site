import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="isDesktop || isTablet || isMobile" class="h-max">
      <app-header></app-header>
      <router-outlet (activate)="onActivate($event)"></router-outlet>
      <app-scroll-to-top></app-scroll-to-top>
      <app-footer></app-footer>
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

  onActivate(event: any) {
    let scrollToTop = window.setInterval(() => {
        let pos = window.scrollY;
        if (pos > 0) {
            window.scrollTo(0, pos - 50); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 1);
  }
}
