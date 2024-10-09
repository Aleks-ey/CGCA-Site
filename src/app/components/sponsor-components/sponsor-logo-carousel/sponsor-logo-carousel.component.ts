import { Component, OnInit, Input, Renderer2, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { interval, Subscription } from "rxjs";
import { SupabaseService } from "src/app/supabase.service";
import { Sponsor } from "src/app/models/sponsor.model";

@Component({
  selector: "app-sponsor-logo-carousel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sponsor-logo-carousel.component.html",
  styles: [
    `
      .carousel-container {
        width: 100%;
        overflow: hidden;
      }
      .pause-animation {
        animation-play-state: paused !important;
      }
    `,
  ],
})
export class SponsorLogoCarouselComponent implements OnInit {
  @Input() bg: string = "slate-400";
  @Input() interval: number = 30; // Default interval is 30 seconds
  @Input() pause: boolean = true;
  @Input() shuffle: boolean = false;
  sponsors: any[] = [];
  sponsors2: any[] = [];
  isPaused = false;

  constructor(
    private supabaseService: SupabaseService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.fetchSponsors();
    this.setAnimations();
  }

  fetchSponsors() {
    this.supabaseService.getAllSponsors().then((response) => {
      if (response.data) {
        let data = response.data.slice(0, 6); // Limit the data to 6 logos
        if (this.shuffle) {
          data = this.shuffleArray(data);
          this.sponsors = [...data]; // Assign shuffled data
          let data2 = [...data]; // Clone the shuffled data before reshuffling
          data2 = this.shuffleArray(data2);
          this.sponsors2 = data2;
        } else {
          this.sponsors = data;
          this.sponsors2 = [...data]; // Clone for the second carousel
        }
      } else if (response.error) {
        console.error("Failed to fetch sponsors:", response.error.message);
        this.sponsors = [];
        this.sponsors2 = [];
      }
    });
  }

  // slide-ltr & slide-rtl keyframes for this are defined in styles.scss
  setAnimations() {
    const elements =
      this.el.nativeElement.querySelectorAll(".animate-slide-ltr");
    elements.forEach((element: HTMLElement) => {
      this.renderer.setStyle(
        element,
        "animation",
        `slide-ltr ${this.interval}s linear infinite`
      );
    });

    const elements2 =
      this.el.nativeElement.querySelectorAll(".animate-slide-rtl");
    elements2.forEach((element: HTMLElement) => {
      this.renderer.setStyle(
        element,
        "animation",
        `slide-rtl ${this.interval}s linear infinite`
      );
    });
  }

  getBgClasses(): string {
    return `bg-${this.bg} before:from-${this.bg} after:to-${this.bg}`; // where bg is the color code or name directly usable in CSS
  }

  shuffleArray(array: Sponsor[]): Sponsor[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(
        (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) *
          (i + 1)
      );
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  pauseCarousel() {
    if (this.pause) {
      this.isPaused = true;
    } else {
      this.isPaused = false;
    }
  }

  resumeCarousel() {
    this.isPaused = false;
  }

  goToWebsite(url: string) {
    window.open(url, "_blank");
  }
}
