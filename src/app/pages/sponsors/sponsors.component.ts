import { Component } from '@angular/core';

export interface sponsor {
  name: string;
  logo: string;
  url: string;
  showInfo: boolean;
}

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent {
  constructor() { }

  sponsor: sponsor = {
    name: '',
    logo: '',
    url: '',
    showInfo: false
  };

  clicked = false;

  sponsorsList = [
    {
      name: 'Sponsor 1',
      logo: 'https://via.placeholder.com/100',
      url: 'https://www.google.com',
      showInfo: false
    },
  ];

  toggleSponsorInfo(sponsor: any) {
    sponsor.showInfo =!sponsor.showInfo;
  }
}
