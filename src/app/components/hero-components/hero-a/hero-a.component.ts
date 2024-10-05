import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-hero-a",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./hero-a.component.html",
})
export class HeroAComponent {
  @Input() title: string = "";
  @Input() description: string = "";
  @Input() buttonText: string = "";
  @Input() buttonLink: string = "";
  @Input() imageSrc?: string;
  @Input() imageAlt: string = "No alt text provided";
  @Input() imageOverlay: string = "";
  @Input() imageLeft: boolean = false;
}
