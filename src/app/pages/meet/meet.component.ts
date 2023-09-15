import { Component } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: `./meet.component.html`,
  styleUrls: ['./meet.component.css']
})
export class MeetComponent {
  cards = [
    { image: 'assets/images/CGCA-LOGO.png', 
    name: 'Tamara Tsaava',
    title: 'President', 
    content: 'Content for Card 1',
    class: 'Tamara-expanded' },

    { image: 'assets/images/CGCA-LOGO.png',
    name: 'Ruslan Huhua',
    title: 'Vice President',
    content: 'Content for Card 2',
    class: 'Ruslan-expanded' },

    { image: 'assets/images/CGCA-LOGO.png',
    name: 'Tea Todua',
    title: 'Board Director',
    content: 'Content for Card 3',
    class: 'Tea-expanded' },

    { image: 'assets/images/CGCA-LOGO.png',
    name: 'Alexander Narsia',
    title: 'Treasurer',
    content: 'Content for Card 4',
    class: 'Alexander-expanded' },

    { image: 'assets/images/CGCA-LOGO.png',
    name: 'Donald Pittser',
    title: 'Secretary',
    content: 'Content for Card 5',
    class: 'Donald-expanded' },
  ];

  currentContent = 'Click a card to see more information.';
}
