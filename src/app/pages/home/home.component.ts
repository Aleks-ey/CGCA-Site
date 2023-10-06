import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-home',
  templateUrl: `home.component.html`,
  styleUrls: ['./home.component.css'
  ]
})
export class HomeComponent {
  
  // --------------------- Unity word change animation ---------------------
  originalWord: string = 'UNITY';
  alternativeWord: string = 'ERTOBA';
  word: string = this.alternativeWord;
  synonyms: string[] = ['UNION', 'WHOLE', 'PEACE', 'LOVE', 'OJAKHI', 'IMEDI', 'ERTAD'];
  synonymChangeInterval?: number;
  wordChangeTimeout?: number;
  displayingOriginalWord: boolean = false;

  ngOnInit(): void {
    this.startCycle();
  }

  startCycle(): void {
    this.wordChangeTimeout = window.setTimeout(() => {
      this.startSynonymChange();
    }, 2000);
  }

  startSynonymChange(): void {
    let synonymIndex = 0;
    
    this.synonymChangeInterval = window.setInterval(() => {
      this.word = this.synonyms[synonymIndex];
      synonymIndex = (synonymIndex + 1) % this.synonyms.length;

      if (synonymIndex === 0) {
        this.endSynonymChange();
      }
    }, 150);
  }

  endSynonymChange(): void {
    clearInterval(this.synonymChangeInterval!);

    // Swap words
    this.word = this.displayingOriginalWord ? this.alternativeWord : this.originalWord;
    this.displayingOriginalWord = !this.displayingOriginalWord;

    this.startCycle();
  }

  ngOnDestroy(): void {
    clearInterval(this.synonymChangeInterval!);
    clearTimeout(this.wordChangeTimeout!);
  }

  // onMouseOver(): void {
  //   this.iterations = 0;
  //   this.startAnimation(() => {
  //     this.word = "UNITY";
  //     this.clearInterval();
  //   });
  // }

  // onMouseOut(): void {
  //   this.iterations = 0;
  //   this.startAnimation(() => {
  //     this.word = this.originalWord;
  //     this.clearInterval();
  //   });
  // }

  // startAnimation(callback: () => void): void {
  //   this.clearInterval(); // To ensure we don't have overlapping intervals.

  //   this.animationInterval = window.setInterval(() => {
  //     this.iterations++;

  //     if (this.iterations <= this.maxIterations) {
  //       // this.word = this.randomizeLetters(this.originalWord);
  //       this.word = this.getRandomSynonym();
  //     } else {
  //       callback();
  //     }
  //   }, 150);
  // }

  // randomizeLetters(word: string): string {
  //   return word.split('').map(letter => {
  //     const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  //     return randomChar;
  //   }).join('');
  // }

  // getRandomSynonym(): string {
  //   const randomIndex = Math.floor(Math.random() * this.synonyms.length);
  //   if (randomIndex != this.lastIndex) {
  //     this.lastIndex = randomIndex;
  //     return this.synonyms[randomIndex];
  //   }
  //   else {
  //     return this.getRandomSynonym();
  //   }
  // }

  // --------------------- --------------------- ---------------------

  // --------------------- cgca_welcome ---------------------

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

    if (topPosition <= (windowHeight - 200) && topPosition >= -200) {
      this.isCgcaBodyVisible = true;
    }
    else {
      this.isCgcaBodyVisible = false;
    }
  }
}
