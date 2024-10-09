import { Component } from "@angular/core";
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
import { SupabaseService } from "src/app/supabase.service";

@Component({
  selector: "app-sponsor-upload",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: "./sponsor-upload.component.html",
})
export class SponsorUploadComponent {
  sponsorForm: FormGroup;
  imageFile: File | null = null;
  logoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar
  ) {
    this.sponsorForm = this.fb.group({
      sponsor: ["", Validators.required],
      description: ["", Validators.required],
      location: [""],
      phone: [""],
      website: [""],
      customFileName: [""],
      customLogoFileName: [""],
    });
  }

  onImageSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;
    if (files) {
      this.imageFile = files[0];
    }
  }

  onLogoSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;
    if (files) {
      this.logoFile = files[0];
    }
  }

  private resetForm(): void {
    this.sponsorForm.reset();
    this.imageFile = null;
    this.logoFile = null;
  }

  async onSubmit() {
    if (this.sponsorForm.valid) {
      try {
        // Generate a unique file name for the upload
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        // Set as null for default
        let imageUrl = null;
        let imageFilename = null;
        let logoUrl = null;
        let logoFilename = null;

        // Check if imageFile is provided, if it is, attach unique suffix to sponsor image file and upload it. Get the URL
        if (this.imageFile) {
          imageFilename = `${uniqueSuffix}-${this.imageFile.name}`;
          const imagePath = `sponsors/${imageFilename}`;
          imageUrl = await this.supabaseService.uploadFile(
            "sponsors",
            imagePath,
            this.imageFile
          );
        }

        // Check if logoFile is provided, if it is, attach unique suffix to sponsor logo file and upload it. Get the URL
        if (this.logoFile) {
          logoFilename = `${uniqueSuffix}-${this.logoFile.name}`;
          const logoPath = `sponsors/${logoFilename}`;
          logoUrl = await this.supabaseService.uploadFile(
            "sponsors",
            logoPath,
            this.logoFile
          );
        }

        // Prepare sponsor data
        const sponsorData = {
          sponsor: this.sponsorForm.value.sponsor,
          description: this.sponsorForm.value.description,
          location: this.sponsorForm.value.location,
          phone: this.sponsorForm.value.phone,
          website: this.sponsorForm.value.website,
          image_url: imageUrl,
          file_name: imageFilename,
          custom_file_name:
            this.sponsorForm.value.customFileName || imageFilename,
          logo_url: logoUrl,
          logo_file_name: logoFilename,
          custom_logo_file_name:
            this.sponsorForm.value.customLogoFileName || logoFilename,
        };

        // Add sponsor entry to Supabase
        await this.supabaseService.addSponsor(sponsorData);
        console.log("Sponsor uploaded successfully!");
        this.resetForm();
        this.snackBar.open("Sponsor added successfully!", "Close", {
          duration: 3000,
        });
      } catch (error) {
        console.error("Error uploading sponsor:", error);
        this.snackBar.open("Failed to add sponsor!", "Close", {
          duration: 3000,
        });
      }
    } else {
      this.snackBar.open("Please fill out all required fields!", "Close", {
        duration: 3000,
      });
    }
  }
}
