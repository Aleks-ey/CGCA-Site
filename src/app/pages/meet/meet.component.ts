import { Component } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: `./meet.component.html`,
  styleUrls: ['./meet.component.css']
})
export class MeetComponent {
  isVisible: boolean = false;

  ngOnInit(){
    // wait 1 second and then change isVisible to true
    setTimeout(() => {
      this.isVisible = true;
    }
    , 500);
  }
  

  // ngAfterViewInit() {
  //   this.isVisible = true;
  // }

  showPopup1 = false;
  showPopup2 = false;
  showPopup3 = false;
  showPopup4 = false;
  showPopup5 = false;

  togglePopup1() {
    this.showPopup1 = !this.showPopup1;
  }

  togglePopup2() {
    this.showPopup2 = !this.showPopup2;
  }

  togglePopup3() {
    this.showPopup3 = !this.showPopup3;
  }

  togglePopup4() {
    this.showPopup4 = !this.showPopup4;
  }

  togglePopup5() {
    this.showPopup5 = !this.showPopup5;
  }
}
