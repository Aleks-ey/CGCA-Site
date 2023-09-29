import { Component, OnInit } from '@angular/core';
import { Photo } from './photo.model';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-georgia-slider',
  templateUrl: './georgia-slider.component.html',
  styleUrls: ['./georgia-slider.component.css'],
})
export class GeorgiaSliderComponent {
  photos: Photo[] = [
    {id: 1, src: 'assets/images/MotherOfGeorgia2.jpg',
      alt: 'Mother of Georgia Statue',
      catagory: 'Georgia',
      catagoryDescription: 'Georgia is a country in the Caucasus region of Eurasia. Located at the crossroads of Western Asia and Eastern Europe, it is bounded to the west by the Black Sea, to the north by Russia, to the south by Turkey and Armenia, and to the southeast by Azerbaijan. The capital and largest city is Tbilisi. Georgia covers a territory of 69,700 square kilometres (26,911 sq mi), and its 2020 population is about 3.989 million. Georgia is a unitary parliamentary republic, with the government elected through a representative democracy.',
      title: 'Image of Georgia',
      description: 'This image is from the mother of Georgia statue in Tbilisi, Georgia.'
    },
    {id: 2, src: 'assets/images/GeorgianFood.jpg',
      alt: 'Assortment of Georgian Food',
      catagory: 'Cuisine',
      catagoryDescription: 'CGCA 2Logo',
      title: 'CGCA Lo2go',
      description: 'CGCA L2ogo'
    },
    {id: 3, src: 'assets/images/GeorgianDance.jpg',
      alt: 'Traditional Georgian Dancers',
      catagory: 'Dance',
      catagoryDescription: 'CGCA3 Logo',
      title: 'CGCA L3ogo',
      description: 'CGC3A Logo'
    },
    {id: 4, src: 'assets/images/Tbilisi2.jpg',
      alt: 'CGCA Logo',
      catagory: 'Landscape',
      catagoryDescription: 'CGC4A Logo',
      title: 'CGCA Log4o',
      description: 'CGCA 4Logo'
    },
    {id: 5, src: 'assets/images/Tbilisi3.jpg',
      alt: 'CGCA Logo',
      catagory: 'Religion',
      catagoryDescription: 'CGC5A Logo',
      title: 'CGCA 5Logo',
      description: 'CGCA 5Logo'
    },
  ];

  displayedPhotos: Photo[] = [];
  currentIndex: number = 0; // start with the third photo in the array as the main one

  constructor() { }

  ngOnInit(): void {
    this.updateDisplayedPhotos();
  }

  updateDisplayedPhotos(): void {
    this.displayedPhotos = [
      this.photos[this.getPhotoIndex(this.currentIndex - 2)],
      this.photos[this.getPhotoIndex(this.currentIndex - 1)],
      this.photos[this.currentIndex],
      this.photos[this.getPhotoIndex(this.currentIndex + 1)],
      this.photos[this.getPhotoIndex(this.currentIndex + 2)],
    ];
  }

  getPhotoIndex(index: number): number {
    const len = this.photos.length;
    return ((index % len) + len) % len; // to handle cyclic nature of photos
  }

  onPhotoClick(index: number): void {
    this.currentIndex = this.getPhotoIndex(this.currentIndex + index - 2);
    this.updateDisplayedPhotos();
  }

  //--------------- for touch ------------------

  touchStartX = 0;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchEndX - this.touchStartX;

    // Adjust this threshold as needed; it's currently 50 pixels
    if (distance > 50) {
      // moved to the right
      this.onPrevious();
    } else if (distance < -50) {
      // moved to the left
      this.onNext();
    }
  }

  onPrevious(): void {
    this.currentIndex = this.getPhotoIndex(this.currentIndex - 1);
    this.updateDisplayedPhotos();
  }

  onNext(): void {
    this.currentIndex = this.getPhotoIndex(this.currentIndex + 1);
    this.updateDisplayedPhotos();
  }


}
