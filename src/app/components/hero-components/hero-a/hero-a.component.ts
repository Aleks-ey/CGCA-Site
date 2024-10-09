import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { ImageDialogComponent } from "../../utility/image-dialog/image-dialog.component";

@Component({
  selector: "app-hero-a",
  standalone: true,
  imports: [RouterModule, CommonModule, MatDialogModule],
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

  constructor(private dialog: MatDialog) {}

  openImageDialog(imageUrl: string, title: string) {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl, title },
      panelClass: "py-10",
    });
  }
}
