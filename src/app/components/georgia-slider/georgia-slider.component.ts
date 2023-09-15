import { Component, OnInit } from '@angular/core';
import { Photo } from './photo.model';

@Component({
  selector: 'app-georgia-slider',
  templateUrl: './georgia-slider.component.html',
  styleUrls: ['./georgia-slider.component.css']
})
export class GeorgiaSliderComponent {
  photos: Photo[] = [
    {id: 1, src: 'assets/images/CGCA-LOGO.png'},
    {id: 2, src: 'assets/images/MotherOfGeorgia2.jpg'},
    {id: 3, src: 'assets/images/Tbilisi1.jpg'},
    {id: 4, src: 'assets/images/Tbilisi2.jpg'},
    {id: 5, src: 'assets/images/Tbilisi3.jpg'},
    {id: 6, src: 'assets/images/MotherOfGeorgia.jpg'},
  ];

  displayedPhotos: Photo[] = [];
  currentIndex: number = 2; // start with the third photo in the array as the main one

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
