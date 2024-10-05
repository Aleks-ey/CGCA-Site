import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Profile, SupabaseService } from "src/app/supabase.service";
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

export interface ForHireListing {
  id?: number;
  profile_id: string;
  name: string;
  profession: string;
  about: string;
  email: string;
  phone_number: string;
  location: string;
  work_outside: boolean;
  approved: boolean;
}

@Component({
  selector: "app-for-hire-listings",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./for-hire-listings.component.html",
  styles: ``,
})
export class ForHireListingsComponent {
  @Input() single: boolean = true;
  @Input() admin: boolean = false;
  @Input() approved: boolean = false;
  @Input() unapproved: boolean = false;
  @Input() edit: boolean = false;

  toggleForm: FormGroup;
  hiresList: ForHireListing[] = [];
  displayedListings: ForHireListing[] = [];
  userId: string = "";
  userEmail: string = "";

  @ViewChild("dialogForHireAdminToggle")
  dialogForHireAdminToggle!: TemplateRef<any>;

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
      const allEditHiresData = await this.supabaseService.getAllHireEdits();
      if (allEditHiresData.error) {
        console.error("Error fetching edits:", allEditHiresData.error);
      } else {
        this.hiresList = allEditHiresData.data ?? [];
      }
    } else {
      const allHiresData = await this.supabaseService.getAllHires();
      if (allHiresData.error) {
        console.error("Error fetching hires:", allHiresData.error);
      } else {
        this.hiresList = allHiresData.data ?? [];
      }
    }

    if (this.single && this.userId) {
      this.displayedListings = this.hiresList.filter(
        (hire) => hire.profile_id === this.userId
      );
    } else {
      this.displayedListings = this.hiresList.filter((hire) =>
        this.approved ? hire.approved : this.unapproved ? !hire.approved : true
      );
    }
  }

  updateListingsDisplay(): void {
    if (this.single && this.admin) {
      console.warn("Single and Admin cannot both be true.");
      this.admin = false;
    }
  }

  openHiresApproval(uuid: string, email: string): void {
    if (!this.admin) return;

    this.userId = uuid;
    this.userEmail = email;
    const isApproved = this.hiresList.some(
      (hire) => hire.profile_id === uuid && hire.approved
    );
    this.toggleForm.get("toggleValue")?.setValue(isApproved);

    const dialogRef = this.dialog.open(this.dialogForHireAdminToggle, {
      height: "auto",
      width: "auto",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  submitHiresApproval(uuid: string): void {
    const toggleValue = this.toggleForm.get("toggleValue")!.value;

    // Determine which update service to use based on 'edit' state
    const updateService = this.edit
      ? this.supabaseService.updateHiresEditApproved(uuid, toggleValue)
      : this.supabaseService.updateHiresApproved(uuid, toggleValue);

    updateService
      .then((response) => {
        console.log("Updated successfully:", response);
        this.closeDialog(); // Close dialog after operation
        sessionStorage.setItem("callSwitchToHires", "true"); // Setting session storage flag
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
