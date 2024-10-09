import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { SupabaseService } from "src/app/supabase.service";
import { CommonModule } from "@angular/common";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { BusinessListing } from "src/app/models/businessListing.model";

@Component({
  selector: "app-business-listings",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./business-listings.component.html",
  styles: ``,
})
export class BusinessListingsComponent {
  @Input() single: boolean = true;
  @Input() admin: boolean = false;
  @Input() approved: boolean = false;
  @Input() unapproved: boolean = false;
  @Input() edit: boolean = false;

  toggleForm: FormGroup;
  businessList: BusinessListing[] = [];
  displayedListings: BusinessListing[] = [];
  userId: string = "";
  userEmail: string = "";

  @ViewChild("dialogBusinessAdminToggle")
  dialogBusinessAdminToggle!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private supabaseService: SupabaseService
  ) {
    this.toggleForm = this.fb.group({
      toggleValue: [false],
    });
  }

  async ngOnInit(): Promise<void> {
    this.userId = (await this.supabaseService.fetchUserId()) as string;
    if (this.userId) {
      await this.fetchListings();
    }
    this.updateListingsDisplay();
  }

  ngOnChanges(): void {
    if (this.userId) {
      this.fetchListings().then(() => this.updateListingsDisplay());
    }
  }

  // Getter to determine the message based on component inputs
  get messageBasedOnFilter(): string {
    if (this.edit) return "edited";
    if (this.approved) return "approved";
    if (this.unapproved) return "unapproved";
    return "approved"; // Default case, can adjust based on what default you prefer
  }

  async fetchListings(): Promise<void> {
    if (this.edit) {
      const allEditData = await this.supabaseService.getAllBusinessEdits();
      if (allEditData.error) {
        console.error("Error fetching business edits:", allEditData.error);
      } else {
        this.businessList = allEditData.data ?? [];
      }
    } else {
      const allData = await this.supabaseService.getAllBusiness();
      if (allData.error) {
        console.error("Error fetching business listings:", allData.error);
      } else {
        this.businessList = allData.data ?? [];
      }
    }

    if (this.single && this.userId) {
      this.displayedListings = this.businessList.filter(
        (business) => business.profile_id === this.userId
      );
    } else {
      this.displayedListings = this.businessList.filter((business) =>
        this.approved
          ? business.approved
          : this.unapproved
          ? !business.approved
          : true
      );
    }
  }

  updateListingsDisplay(): void {
    if (this.single && this.admin) {
      console.warn("Single and Admin cannot both be true.");
      this.admin = false;
    }
  }

  openBusinessApproval(uuid: string, email: string): void {
    if (!this.admin) return;

    this.userId = uuid;
    this.userEmail = email;
    const isApproved = this.businessList.some(
      (business) => business.profile_id === uuid && business.approved
    );
    this.toggleForm.get("toggleValue")?.setValue(isApproved);

    const dialogRef = this.dialog.open(this.dialogBusinessAdminToggle, {
      height: "auto",
      width: "auto",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  submitBusinessApproval(uuid: string): void {
    const toggleValue = this.toggleForm.get("toggleValue")!.value;

    // Determine which update service to use based on 'edit' state
    const updateService = this.edit
      ? this.supabaseService.updateBusinessEditApproved(uuid, toggleValue)
      : this.supabaseService.updateBusinessApproved(uuid, toggleValue);

    updateService
      .then((response) => {
        console.log("Updated successfully:", response);
        this.closeDialog(); // Close dialog after operation
        sessionStorage.setItem("callSwitchToBusiness", "true"); // Setting session storage flag
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating:", error);
      });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
