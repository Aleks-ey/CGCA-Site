import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { SupabaseService } from "src/app/supabase.service";
import { Sponsor } from "src/app/models/sponsor.model";

@Component({
  selector: "app-sponsor-update",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
  ],
  templateUrl: "./sponsor-update.component.html",
})
export class SponsorUpdateComponent implements OnInit {
  sponsors: Sponsor[] = [];
  sponsorForm: FormGroup;
  filteredSponsors: Observable<Sponsor[]> | undefined;
  selectedSponsor: Sponsor | undefined;
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
      image: [""],
      logo: [""],
      imageName: [""],
      logoName: [""],
      customFileName: [""],
      customLogoFileName: [""],
    });
  }

  ngOnInit(): void {
    this.supabaseService.getAllSponsors().then((response) => {
      if (response.data) {
        this.sponsors = response.data;
        this.setupFilteredSponsors();
      } else if (response.error) {
        console.error("Failed to fetch sponsors:", response.error.message);
      }
    });
  }

  private setupFilteredSponsors(): void {
    this.filteredSponsors = this.sponsorControl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.sponsor)),
      map((name) => this._filter(name))
    );
  }

  get sponsorControl(): FormControl {
    const control = this.sponsorForm.get("sponsor");
    if (control instanceof FormControl) {
      return control;
    } else {
      throw new Error("Sponsor control is not a FormControl");
    }
  }

  displayFn(sponsor: Sponsor): string {
    return sponsor && sponsor.sponsor ? sponsor.sponsor : "";
  }

  private _filter(name: string): Sponsor[] {
    const filterValue = name.toLowerCase();
    return this.sponsors.filter((option) =>
      option.sponsor.toLowerCase().includes(filterValue)
    );
  }

  onSponsorSelected(selected: Sponsor): void {
    this.selectedSponsor = selected;
    this.sponsorForm.patchValue({
      sponsor: selected.sponsor,
      description: selected.description,
      location: selected.location,
      phone: selected.phone,
      website: selected.website,
      image: selected.image_url,
      logo: selected.logo_url,
      imageName: selected.file_name,
      logoName: selected.logo_file_name,
      customFileName: selected.custom_file_name,
      customLogoFileName: selected.custom_logo_file_name,
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
    this.selectedSponsor = undefined;
    this.imageFile = null;
    this.logoFile = null;
    // refresh the list of sponsors
  }

  async onSubmit(): Promise<void> {
    if (this.sponsorForm.valid && this.selectedSponsor) {
      if (!this.selectedSponsor.id) {
        console.error("Selected sponsor does not have an ID");
        return;
      }
      // Generate a unique file name for the upload
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      let newImageFilename = null;
      let newImageUrl = null;
      let newLogoFilename = null;
      let newLogoUrl = null;

      // Check if imageFile is provided, if it is, attach unique suffix to sponsor image file and upload it. Get the URL
      if (this.imageFile) {
        newImageFilename = `${uniqueSuffix}-${this.imageFile.name}`;
        const imagePath = `sponsors/${newImageFilename}`;
        newImageUrl = await this.supabaseService.uploadFile(
          "sponsors",
          imagePath,
          this.imageFile
        );
        // Delete old image if new one is uploaded
        if (this.selectedSponsor.image_url && this.selectedSponsor.file_name) {
          await this.supabaseService.deleteFile(
            "sponsors",
            this.selectedSponsor.file_name
          );
        }
      }

      // Check if logoFile is provided, if it is, attach unique suffix to sponsor logo file and upload it. Get the URL
      if (this.logoFile) {
        newLogoFilename = `${uniqueSuffix}-${this.logoFile.name}`;
        const logoPath = `sponsors/${newLogoFilename}`;
        newLogoUrl = await this.supabaseService.uploadFile(
          "sponsors",
          logoPath,
          this.logoFile
        );
        // Delete old logo if new one is uploaded
        if (
          this.selectedSponsor.logo_url &&
          this.selectedSponsor.logo_file_name
        ) {
          await this.supabaseService.deleteFile(
            "sponsors",
            this.selectedSponsor.logo_file_name
          );
        }
      }

      // Prepare updated data, including new image URLs if they were updated
      const updatedData = {
        ...this.sponsorForm.value,
        image_url: newImageUrl
          ? newImageUrl
          : this.selectedSponsor.image_url || null,
        logo_url: newLogoUrl
          ? newLogoUrl
          : this.selectedSponsor.logo_url || null,
        file_name: newImageUrl
          ? this.sponsorForm.value.customFileName || newImageFilename
          : this.selectedSponsor.file_name || null,
        logo_file_name: newLogoUrl
          ? this.sponsorForm.value.customLogoFileName || newLogoFilename
          : this.selectedSponsor.logo_file_name || null,
      };

      try {
        await this.supabaseService.updateSponsor(
          this.selectedSponsor.id,
          updatedData
        );
        console.log("Sponsor updated successfully");
        this.snackBar.open("Sponsor updated successfully!", "Close", {
          duration: 3000,
        });
        this.resetForm();
      } catch (error) {
        console.error("Error updating sponsor:", error);
        this.snackBar.open("Failed to update sponsor!", "Close", {
          duration: 3000,
        });
      }
    } else {
      this.snackBar.open("Form is not valid!", "Close", { duration: 3000 });
    }
  }
}
