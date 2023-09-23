import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: `mission.component.html`,
  styleUrls: ['./mission.component.css'
  ]
})
export class MissionComponent {
  isVisible:boolean = false;

  constructor(private el: ElementRef) {}

  // ngOnInit() {
  //   const topPosition = this.el.nativeElement.getBoundingClientRect().top;
  //   const windowHeight = window.innerHeight;

  //   if (topPosition <= windowHeight -20 && topPosition >= -20) {
  //     this.isVisible = true;
  //   } else {
  //     this.isVisible = false;
  //   }
  // }

  ngAfterViewInit() {
    this.isVisible = true;
  }
}
