import { CommonModule } from "@angular/common";
import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { SupabaseService } from "src/app/supabase.service";

@Component({
  selector: "app-listings-action-buttons",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: "./listings-action-buttons.component.html",
})
export class ListingsActionButtonsComponent {
  @Input() editOnly: boolean = false;

  @Input() editLabel: string = "Edit";
  @Input() deleteLabel: string = "Delete";
  @Input() editFunction!: () => void;
  @Input() deleteFunction!: () => Promise<boolean>;

  // Inputs for dialog text customization
  @Input() deleteDialogTitle: string = "Delete Listing";
  @Input() deleteDialogMessage: string =
    "Are you sure you want to delete this listing?";
  @Input() deleteDialogWarning: string = "This action cannot be undone.";
  @Input() successMessage: string = "Listing deleted successfully!";
  @Input() failMessage: string =
    "There was an error deleting the listing. Please try again.";

  @ViewChild("deleteDialog") deleteDialog!: TemplateRef<any>;
  @ViewChild("successDialog") successDialog!: TemplateRef<any>;
  @ViewChild("failDialog") failDialog!: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    private supabaseService: SupabaseService
  ) {}

  onEdit() {
    if (this.editFunction) {
      this.editFunction();
    }
  }

  // Open delete confirmation dialog
  onDelete() {
    this.dialog.open(this.deleteDialog);
  }

  // Confirm delete action
  async onConfirmDelete() {
    try {
      const success = await this.deleteFunction(); // Calls parent delete function
      if (success) {
        this.dialog.open(this.successDialog); // Show success dialog
        setTimeout(() => window.location.reload(), 3000); // Optionally reload the page
      } else {
        this.dialog.open(this.failDialog); // Show failure dialog
      }
    } catch (error) {
      this.dialog.open(this.failDialog); // Show failure dialog on error
      console.error(error);
    }
  }
}
