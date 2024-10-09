import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
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
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { SupabaseService } from "src/app/supabase.service";
import { Sponsor } from "src/app/models/sponsor.model";

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
export class SponsorDeleteComponent {
  sponsors: Sponsor[] = [];
  sponsorControl = new FormControl();
  filteredSponsors: Observable<any[]>;

  constructor(
    private supabaseService: SupabaseService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
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

  deleteSponsor(sponsorId: number): void {
    this.supabaseService
      .deleteSponsor(sponsorId)
      .then(() => {
        console.log("Sponsor and associated image deleted successfully");
        // Refresh the list of sponsors or handle UI feedback
        this.sponsors = this.sponsors.filter((s) => s.id !== sponsorId);
      })
      .catch((error) => {
        console.error("Failed to delete sponsor", error);
      });
  }
}
