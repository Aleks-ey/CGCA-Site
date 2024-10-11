import { Component, OnInit, AfterViewInit, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SupabaseService } from "src/app/supabase.service";
import { GalleryImage } from "src/app/models/galleryImage.model";
import { NgxMasonryModule, NgxMasonryOptions } from "ngx-masonry";
import { ImageDialogComponent } from "../../utility/image-dialog/image-dialog.component";

@Component({
  selector: "app-gallery-display",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    NgxMasonryModule,
  ],
  templateUrl: "./gallery-display.component.html",
})
export class GalleryDisplayComponent implements OnInit {
  galleryImages: GalleryImage[] = [];
  events: string[] = [];
  selectedEvents: string[] = []; // For event filter
  pageIndex: number = 0; // Current page index
  pageSize: number = 25; // Number of images per page
  totalImages: number = 0; // Total number of images for the query
  loading: boolean = false; // Track loading stat
  delayedLoad: boolean = false;
  currentWindowWidth: number = 0;
  currentBreakpoint =
    this.currentWindowWidth >= 1024
      ? "lg"
      : this.currentWindowWidth >= 768
      ? "md"
      : this.currentWindowWidth >= 430
      ? "sm"
      : "xs";

  public myOptions: NgxMasonryOptions = {
    percentPosition: true,
    itemSelector: ".grid-item",
    stamp: ".stamp",
  };

  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentWindowWidth = window.innerWidth;
    this.fetchEvents(); // Fetch distinct events
    this.fetchGalleryImages(); // Fetch initial gallery images
  }

  // Fetch distinct events for the event filter
  async fetchEvents() {
    try {
      this.events = await this.supabaseService.getAllGalleryEvents();
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  // Fetch paginated gallery images with optional event filtering
  async fetchGalleryImages(
    pageIndex: number = 0,
    selectedEvents: string[] = this.selectedEvents
  ) {
    try {
      this.loading = true; // start spinner
      this.delayedLoad = true;
      const offset = pageIndex * this.pageSize;
      const result = await this.supabaseService.getGalleryImagesPaginated(
        this.pageSize,
        offset,
        selectedEvents
      );

      this.galleryImages = result.data;
      this.totalImages = result.count || 0; // Total images for pagination

      // Shuffle images only if no event is selected
      if (selectedEvents.length === 0) {
        this.shuffleImages();
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      this.loading = false; // stop spinner
      //delay then delayd loading equal false
      setTimeout(() => {
        this.delayedLoad = false;
      }, 2000);
    }
  }

  // Handle event filter change
  onEventFilterChange(selectedEvents: string[]) {
    this.selectedEvents = selectedEvents;
    this.pageIndex = 0; // Reset to first page when filters change
    this.fetchGalleryImages(); // Refetch images with new filter
  }

  // Handle page change
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.fetchGalleryImages(this.pageIndex);
    document.getElementById("eventSelectForm")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  // Shuffle images for initial random order
  shuffleImages() {
    this.galleryImages = this.galleryImages.sort(() => Math.random() - 0.5);
  }

  openImageDialog(imageUrl: string, title: string) {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl, title },
      panelClass: "py-10",
    });
  }

  @HostListener("window:resize")
  onResize() {
    this.currentWindowWidth = window.innerWidth;
    const lastBreakpoint = this.currentBreakpoint;
    this.currentBreakpoint =
      this.currentWindowWidth >= 1024
        ? "lg"
        : this.currentWindowWidth >= 768
        ? "md"
        : this.currentWindowWidth >= 430
        ? "sm"
        : "xs";
    if (lastBreakpoint != this.currentBreakpoint) {
      this.fetchGalleryImages(this.pageIndex);
    }
  }
}
