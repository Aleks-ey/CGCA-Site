import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SupabaseService } from "src/app/supabase.service";
import { Sponsor } from "src/app/models/sponsor.model";

@Component({
  selector: "app-sponsor-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sponsor-list.component.html",
})
export class SponsorListComponent implements OnInit {
  @Input() image: boolean = false;
  @Input() alternate: boolean = false;
  sponsors: Sponsor[] = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.fetchSponsors();
  }

  fetchSponsors(): void {
    this.supabaseService.getAllSponsors().then((response) => {
      if (response.data) {
        this.sponsors = this.shuffleArray(response.data);
      } else {
        console.error("Failed to fetch sponsors:", response.error?.message);
      }
    });
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

  goToWebsite(url: string | null) {
    if (url) {
      window.open(url, "_blank");
    } else {
      return;
    }
  }
}
