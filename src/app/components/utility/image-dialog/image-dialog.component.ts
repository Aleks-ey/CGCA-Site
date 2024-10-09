import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: "app-image-dialog",
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <div class="flex h-[90vh] w-[90vw] justify-center items-center">
      <img
        [src]="data.imageUrl"
        [alt]="data.title"
        class="h-full max-w-full max-h-screen"
      />
    </div>
  `,
  styles: [
    `
      img {
        object-fit: contain;
      }
    `,
  ],
})
export class ImageDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string; title: string }
  ) {}
}
