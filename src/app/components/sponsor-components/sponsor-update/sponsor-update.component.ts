import { Component, OnInit, OnDestroy } from "@angular/core";
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
import { RefreshService } from "src/app/services/refresh.service";
import { Subscription } from "rxjs";

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
export class SponsorUpdateComponent implements OnInit, OnDestroy {
  private refreshSubscription!: Subscription;

  sponsors: Sponsor[] = [];
  sponsorForm: FormGroup;
  filteredSponsors: Observable<Sponsor[]> | undefined;
  selectedSponsor: Sponsor | undefined;
  imageFile: File | null = null;
  logoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    private refreshService: RefreshService
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

    this.refreshSubscription = this.refreshService.refreshObservable.subscribe(
      (context) => {
        if (context === "sponsors") {
          this.resetForm();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }

  resetForm() {
    this.sponsorForm.reset();
    this.selectedSponsor = undefined;
    this.imageFile = null;
    this.logoFile = null;
    // refresh the list of sponsors
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

  async onSubmit(): Promise<void> {
    if (this.sponsorForm.valid && this.selectedSponsor) {
      if (!this.selectedSponsor.id) {
        console.error("Selected sponsor does not have an ID");
        return;
      }
      // Generate a unique file name for the upload
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      let newImageFilename = null;
      let imagePath = null;
      let newImageUrl = null;
      let newLogoFilename = null;
      let logoPath = null;
      let newLogoUrl = null;

      let oldFileName = null;
      if (this.selectedSponsor.file_name) {
        oldFileName = this.selectedSponsor.file_name;
      }
      let oldLogoFileName = null;
      if (this.selectedSponsor.logo_file_name) {
        oldLogoFileName = this.selectedSponsor.logo_file_name;
      }

      // Check if imageFile is provided, if it is, attach unique suffix to sponsor image file and upload it. Get the URL
      if (this.imageFile) {
        newImageFilename = `${uniqueSuffix}-${this.imageFile.name}`;
        imagePath = `sponsors/${newImageFilename}`;
        newImageUrl = await this.supabaseService.uploadFile(
          "sponsors",
          imagePath,
          this.imageFile
        );
      }

      // Check if logoFile is provided, if it is, attach unique suffix to sponsor logo file and upload it. Get the URL
      if (this.logoFile) {
        newLogoFilename = `${uniqueSuffix}-${this.logoFile.name}`;
        logoPath = `sponsors/${newLogoFilename}`;
        newLogoUrl = await this.supabaseService.uploadFile(
          "sponsors",
          logoPath,
          this.logoFile
        );
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

        // Delete old images if new ones were uploaded and sponsor updated successfully
        if (this.imageFile && oldFileName) {
          const oldImagePath = `sponsors/${oldFileName}`;
          await this.supabaseService.deleteFile("sponsors", oldImagePath);
          console.log("Old sponsor image deleted successfully");
        }
        if (this.logoFile && oldLogoFileName) {
          const oldLogoPath = `sponsors/${oldLogoFileName}`;
          await this.supabaseService.deleteFile("sponsors", oldLogoPath);
          console.log("Old sponsor logo deleted successfully");
        }

        this.snackBar.open("Sponsor updated successfully!", "Close", {
          duration: 3000,
        });

        this.resetForm(); // refresh self
        this.refreshService.triggerRefresh("sponsors"); // Notify other components to refresh
      } catch (error) {
        console.error("Error updating sponsor:", error);
        this.snackBar.open("Failed to update sponsor!", "Close", {
          duration: 3000,
        });

        // If image or logo were provided, delete them from bucket
        if (this.imageFile && imagePath) {
          await this.supabaseService.deleteFile("sponsors", imagePath);
          console.log(
            "Deleted attempted update for image with path: " + imagePath
          );
        }
        if (this.logoFile && logoPath) {
          await this.supabaseService.deleteFile("sponsors", logoPath);
          console.log(
            "Deleted attempted update for logo with path: " + logoPath
          );
        }
      }
    } else {
      this.snackBar.open("Form is not valid!", "Close", { duration: 3000 });
    }
  }
}
