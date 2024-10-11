import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { SupabaseService } from "src/app/supabase.service";
import { GalleryImage } from "src/app/models/galleryImage.model";
import { RefreshService } from "src/app/services/refresh.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-gallery-upload",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    DragDropModule,
  ],
  templateUrl: "./gallery-upload.component.html",
})
export class GalleryUploadComponent implements OnInit, OnDestroy {
  private refreshSubscription!: Subscription;

  uploadForm: FormGroup;
  imageFile: File | null = null; // Single image
  imageFiles: File[] = []; // Multiple images
  isMultiple: boolean = false; // Toggle between single/multiple

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    private refreshService: RefreshService
  ) {
    this.uploadForm = this.fb.group({
      event: ["", Validators.required], // Event field
      customFileName: [""], // Custom file name for single image
      imageFile: [null], // Image file input (single/multiple)
    });
  }

  ngOnInit(): void {
    // Subscribe to the refresh observable
    this.refreshSubscription = this.refreshService.refreshObservable.subscribe(
      (context) => {
        if (context === "gallery") {
          this.resetForm();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }

  // Reset the form
  resetForm() {
    this.uploadForm.reset();
    this.imageFile = null;
    this.imageFiles = [];
  }

  // Handle file/folder drop
  async onDrop(event: any) {
    event.preventDefault();
    const items = event.dataTransfer.items;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();

        if (item.isFile) {
          const file = items[i].getAsFile();
          this.imageFiles.push(file);
        } else if (item.isDirectory) {
          this.readDirectory(item); // Handle folder contents
        }
      }
    }
  }

  // Read folder contents recursively
  readDirectory(directoryEntry: any) {
    const dirReader = directoryEntry.createReader();
    dirReader.readEntries(async (entries: any) => {
      for (let entry of entries) {
        if (entry.isFile) {
          entry.file((file: File) => {
            this.imageFiles.push(file); // Add the file to the list
          });
        } else if (entry.isDirectory) {
          this.readDirectory(entry); // Recursive read for nested folders
        }
      }
    });
  }

  // Handle drag over (visual feedback)
  onDragOver(event: any) {
    event.preventDefault();
    event.target.classList.add("border-rojo-red");
  }

  // Handle drag leave (remove visual feedback)
  onDragLeave(event: any) {
    event.preventDefault();
    event.target.classList.remove("border-rojo-red");
  }

  // Handle file input (single or multiple)
  onFileChange(event: any) {
    if (this.isMultiple) {
      this.imageFiles = event.target.files;
    } else {
      this.imageFile = event.target.files[0];
    }
  }

  // Remove a file from the files array before uploading
  removeFile(index: number) {
    this.imageFiles.splice(index, 1); // Remove the file by index
  }

  // Toggle between single and multiple image uploads
  toggleMultipleUpload() {
    this.isMultiple = !this.isMultiple;
    // Reset file inputs if mode is toggled
    this.imageFile = null;
    this.imageFiles = [];
  }

  // Upload logic for single image
  async uploadSingleImage() {
    const event = this.uploadForm.get("event")?.value;
    const customFileName = this.uploadForm.get("customFileName")?.value;

    if (this.imageFile) {
      const uniqueSuffix = new Date().getTime(); // Create a unique identifier for the file name
      const imageFilename = `${uniqueSuffix}-${this.imageFile.name}`;
      const imagePath = `${event}/${imageFilename}`;

      try {
        // Upload single file
        const imageUrl = await this.supabaseService.uploadFile(
          "gallery",
          imagePath,
          this.imageFile
        );

        // Create a gallery image object with both file_name and custom_file_name
        const galleryImage: GalleryImage = {
          image_url: imageUrl,
          file_name: this.imageFile.name, // Original file name (with unique suffix added)
          custom_file_name: customFileName || this.imageFile.name, // Optional custom name provided by the user
          event,
        };

        // Save the gallery image data to the database
        await this.supabaseService.addGalleryImageData(galleryImage);
        this.snackBar.open("Single Image Uploaded successfully!", "Close", {
          duration: 3000,
        });
        this.resetForm(); // refresh self
        this.refreshService.triggerRefresh("gallery"); // Notify other components to refresh
      } catch (error) {
        console.error("Error uploading single image:", error);
        this.snackBar.open("Error uploading single image!", "Close", {
          duration: 3000,
        });
      }
    }
  }

  // Upload logic for multiple images
  async uploadMultipleImages() {
    const event = this.uploadForm.get("event")?.value;

    if (this.imageFiles.length > 0) {
      const uploadTasks = [];

      for (let file of this.imageFiles) {
        const uniqueSuffix = new Date().getTime(); // Generate unique identifier
        const imageFilename = `${uniqueSuffix}-${file.name}`;
        const imagePath = `${event}/${imageFilename}`;

        uploadTasks.push({
          path: imagePath,
          file,
        });
      }

      try {
        // Upload multiple files
        const imageUrls = await this.supabaseService.uploadMultipleFiles(
          "gallery",
          uploadTasks
        );

        // Save each image to the database
        for (let i = 0; i < imageUrls.length; i++) {
          const galleryImage: GalleryImage = {
            image_url: imageUrls[i], // URL returned from the storage upload
            file_name: this.imageFiles[i].name, // Actual file name with the unique identifier
            custom_file_name: this.imageFiles[i].name, // For multiple uploads, custom_file_name matches file_name
            event,
          };

          // Insert each image into the gallery table
          await this.supabaseService.addGalleryImageData(galleryImage);
        }

        this.snackBar.open("Multiple Images Uploaded successfully!", "Close", {
          duration: 3000,
        });
        this.resetForm(); // refresh self
        this.refreshService.triggerRefresh("gallery"); // Notify other components to refresh
      } catch (error) {
        console.error("Error uploading multiple images:", error);
        this.snackBar.open("Error uploading multiple images!", "Close", {
          duration: 3000,
        });
      }
    }
  }

  // Form submission handler
  async onSubmit() {
    if (this.isMultiple) {
      await this.uploadMultipleImages();
    } else {
      await this.uploadSingleImage();
    }
  }
}
