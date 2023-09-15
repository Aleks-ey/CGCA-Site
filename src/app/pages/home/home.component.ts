import { Component, ElementRef, HostListener } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-home',
  templateUrl: `home.component.html`,
  styleUrls: ['./home.component.css'
  ]
})
export class HomeComponent {
  
  originalWord: string = 'ERTOBA';
  word: string = this.originalWord;
  animationInterval?: number;
  maxIterations = 5;
  iterations = 0;
  lastIndex = 0;

  synonyms: string[] = ['UNION', 'WHOLE', 'PEACE', 'LOVE', 'OJAKHI', 'IMEDI', 'ERTAD'];

  onMouseOver(): void {
    this.iterations = 0;
    this.startAnimation(() => {
      this.word = "UNITY";
      this.clearInterval();
    });
  }

  onMouseOut(): void {
    this.iterations = 0;
    this.startAnimation(() => {
      this.word = this.originalWord;
      this.clearInterval();
    });
  }

  startAnimation(callback: () => void): void {
    this.clearInterval(); // To ensure we don't have overlapping intervals.

    this.animationInterval = window.setInterval(() => {
      this.iterations++;

      if (this.iterations <= this.maxIterations) {
        // this.word = this.randomizeLetters(this.originalWord);
        this.word = this.getRandomSynonym();
      } else {
        callback();
      }
    }, 150);
  }

  // randomizeLetters(word: string): string {
  //   return word.split('').map(letter => {
  //     const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  //     return randomChar;
  //   }).join('');
  // }

  getRandomSynonym(): string {
    const randomIndex = Math.floor(Math.random() * this.synonyms.length);
    if (randomIndex != this.lastIndex) {
      this.lastIndex = randomIndex;
      return this.synonyms[randomIndex];
    }
    else {
      return this.getRandomSynonym();
    }
  }

  clearInterval(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = undefined;
    }
  }

  getFontSize(): string {
    return this.word === this.originalWord ? '20vw' : '20vw'; // Adjust sizes as needed
  }

  // ----------------- cgca_welcome -------------------

  isCgcaHeaderVisible:boolean = false;
  isCgcaBodyVisible:boolean = false;

  constructor(private el: ElementRef, private deviceService: DeviceDetectorService) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const topPosition = this.el.nativeElement.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (topPosition <= (windowHeight - 320) && topPosition >= -320) {
      this.isCgcaHeaderVisible = true;
    } else {
      this.isCgcaHeaderVisible = false;
    }

    if (topPosition <= (windowHeight - 560) && topPosition >= -560) {
      this.isCgcaBodyVisible = true;
    }
    else {
      this.isCgcaBodyVisible = false;
    }
  }
}
