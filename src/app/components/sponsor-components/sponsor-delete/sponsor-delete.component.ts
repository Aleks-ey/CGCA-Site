import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
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
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { SupabaseService } from "src/app/supabase.service";
import { Sponsor } from "src/app/models/sponsor.model";
import { RefreshService } from "src/app/services/refresh.service";

@Component({
  selector: "app-sponsor-delete",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: "./sponsor-delete.component.html",
})
export class SponsorDeleteComponent implements OnInit, OnDestroy {
  private refreshSubscription!: Subscription;

  sponsors: Sponsor[] = [];
  sponsorControl = new FormControl();
  filteredSponsors: Observable<any[]>;

  constructor(
    private supabaseService: SupabaseService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private refreshService: RefreshService
  ) {
    this.filteredSponsors = this.sponsorControl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.sponsor)),
      map((name) => (name ? this._filter(name) : this.sponsors.slice()))
    );
  }

  ngOnInit(): void {
    this.supabaseService.getAllSponsors().then((response) => {
      if (response.data) {
        this.sponsors = response.data;
      } else if (response.error) {
        console.error("Failed to fetch sponsors:", response.error.message);
      }
    });

    // Subscribe to the refresh observable
    this.refreshSubscription = this.refreshService.refreshObservable.subscribe(
      (context) => {
        if (context === "sponsors") {
          this.resetForm();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe;
  }

  resetForm() {
    this.sponsorControl.setValue("");
    this.supabaseService.getAllSponsors().then((response) => {
      if (response.data) {
        this.sponsors = response.data;
      } else if (response.error) {
        console.error("Failed to fetch sponsors:", response.error.message);
      }
    });
  }

  displayFn(sponsor: Sponsor): string {
    return sponsor && sponsor.sponsor ? sponsor.sponsor : "";
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.sponsors.filter((option) =>
      option.sponsor.toLowerCase().includes(filterValue)
    );
  }

  @ViewChild("dialogConfirmDelete")
  dialogConfirmDelete!: TemplateRef<any>;

  openDialog(sponsorId: number) {
    this.dialog.open(this.dialogConfirmDelete, {
      data: { sponsorId },
    });
  }

  deleteSponsorConfirmed(sponsorId: number) {
    // User confirmed deletion
    this.deleteSponsor(sponsorId);
    this.dialog.closeAll();
    this.snackBar.open("Sponsor deleted successfully", "Close", {
      duration: 3000,
    });

    //clear search
    this.sponsorControl.setValue("");
    this.filteredSponsors = this.sponsorControl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.sponsor)),
      map((name) => (name ? this._filter(name) : this.sponsors.slice()))
    );
    //refresh list of sponsors
    this.supabaseService.getAllSponsors().then((response) => {
      if (response.data) {
        this.sponsors = response.data;
      } else if (response.error) {
        console.error("Failed to fetch sponsors:", response.error.message);
      }
    });
  }

  deleteSponsorCanceled() {
    // User canceled
    this.dialog.closeAll();
    this.snackBar.open("Sponsor deletion canceled", "Close", {
      duration: 3000,
    });
  }

  async deleteSponsor(sponsorId: number): Promise<void> {
    try {
      // Get sponsor details before deletion
      const { data: sponsor } = await this.supabaseService.getSponsor(
        sponsorId
      );
      if (!sponsor) {
        console.error("Sponsor not found.");
        return;
      }

      // Attempt to delete the sponsor
      const deleteResponse = await this.supabaseService.deleteSponsor(
        sponsorId
      );
      if (deleteResponse != null) {
        throw deleteResponse;
      } else {
        console.log("Sponsor deleted successfully");

        // If sponsor has associated image, delete it
        if (sponsor.file_name) {
          const imagePath = `sponsors/${sponsor.file_name}`;
          await this.supabaseService.deleteFile("sponsors", imagePath);
          console.log("Sponsor image deleted successfully");
        }

        // If sponsor has associated logo, delete it
        if (sponsor.logo_file_name) {
          const logoPath = `sponsors/${sponsor.logo_file_name}`;
          await this.supabaseService.deleteFile("sponsors", logoPath);
          console.log("Sponsor logo deleted successfully");
        }

        this.resetForm(); // refresh self
        this.sponsors = this.sponsors.filter((s) => s.id !== sponsorId); // Update UI or state
        this.refreshService.triggerRefresh("sponsors"); // Notify other components to refresh
      }
    } catch (error) {
      console.error("Failed to delete sponsor and associated images", error);
    }
  }
}
