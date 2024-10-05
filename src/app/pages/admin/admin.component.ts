import { Component, TemplateRef, ViewChild } from "@angular/core";
import { Profile, SupabaseService } from "src/app/supabase.service";
import { CalendarEvent } from "../events/calendarEvent.model";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "src/app/components/login/login.component";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent {
  event: CalendarEvent = {
    date: "",
    description: "",
    time: "",
    title: "",
    image_url: "",
  };

  eventsList: CalendarEvent[] = [];
  selectedEventId?: number;

  isLoggedIn = false;
  userEmail: any;
  isAdmin = false;
  userId = "";
  // private sub!: Subscription;

  switchForm: number = 0;
  hireSwitchForm: number = 0;
  businessSwitchForm: number = 0;
  jobSwitchForm: number = 0;

  @ViewChild("dialogNewHires") dialogNewHires!: TemplateRef<any>;
  @ViewChild("dialogNewBusiness") dialogNewBusiness!: TemplateRef<any>;
  @ViewChild("dialogNewJobs") dialogNewJobs!: TemplateRef<any>;
  toggleForm: FormGroup;

  constructor(
    private supabaseService: SupabaseService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.toggleForm = this.fb.group({
      toggleValue: [false], // default value
    });
  }

  async ngOnInit() {
    // Initialize user profile data.
    let profileData: any;
    this.userId = (await this.supabaseService.fetchUserId()) as string;
    if (this.userId) {
      this.isLoggedIn = true;
      profileData = await this.supabaseService.getProfile(this.userId);
      this.userEmail = profileData.data?.email;
      if (this.userEmail == "admin@admin.com") {
        this.isAdmin = true;
      }
    }
    // fetch events
    const allEventsData = await this.supabaseService.getAllEvents();
    if (allEventsData.error) {
      console.error("Error fetching events:", allEventsData.error);
    } else {
      this.eventsList = allEventsData.data!;
    }

    // Check if there are any flags set in session storage to switch to a specific form
    if (sessionStorage.getItem("callSwitchToHires") === "true") {
      this.switchToHires();
      // Remove the flag from session storage
      sessionStorage.removeItem("callSwitchToHires");
    }
    if (sessionStorage.getItem("callSwitchToBusinesses") === "true") {
      this.switchToBusinesses();
      // Remove the flag from session storage
      sessionStorage.removeItem("callSwitchToBusinesses");
    }
    if (sessionStorage.getItem("callSwitchToJobBoard") === "true") {
      this.switchToJobBoard();
      // Remove the flag from session storage
      sessionStorage.removeItem("callSwitchToJobBoard");
    }
  }

  // Upload image
  private file: File | null = null;
  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }
  async upload() {
    if (!this.file) {
      alert("Please select a file first.");
      return;
    }
    try {
      const url = await this.supabaseService.uploadFile(
        `admin/assets/${this.file.name}`,
        this.file
      );
      alert("File uploaded successfully: " + url);
      return url;
    } catch (error) {
      console.error("Upload error", error);
      return null;
    }
  }
  // Add event
  async submitEvent() {
    const url = await this.upload();
    console.log("URL:", url);
    if (url) {
      this.event.image_url = url;
      const result = await this.supabaseService.addEvent(this.event);
      if (result.error) {
        console.error("Error inserting data:", result.error);
      } else {
        console.log("Event added successfully!");
        await this.fetchEvents();
        this.event = {
          date: "",
          description: "",
          time: "",
          title: "",
          image_url: "",
        };
      }
    } else {
      console.error("Error uploading image");
    }
  }
  // Fetch events
  async fetchEvents() {
    const { data, error } = await this.supabaseService.getAllEvents();
    if (error) {
      console.error("Error fetching events:", error);
    } else {
      this.eventsList = data || [];
    }
  }
  // Delete event
  async deleteEvent() {
    if (this.selectedEventId) {
      const result = await this.supabaseService.deleteEvent(
        this.selectedEventId
      );
      if (result.error) {
        console.error("Error deleting event:", result.error);
      } else {
        console.log("Event deleted successfully!");
        // Remove the deleted event from the eventsList
        this.eventsList = this.eventsList.filter(
          (event) => event.id !== this.selectedEventId
        );
        this.selectedEventId = undefined;
      }
    }
  }
  // Open login dialog
  async openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      this.isLoggedIn = result;
      if (this.isLoggedIn == true) {
        window.location.reload();
      }
    });
  }
  // Logout function
  async logout() {
    this.supabaseService.signOut();
    this.isLoggedIn = false;
    // reload window with small delay to allow signout to complete
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
  // ------------------------------- SWITCH FORMS -------------------------------
  switchToEvents(): void {
    this.switchForm = 1;
  }
  // Hire Switches
  switchToHires(): void {
    this.switchForm = 2;
  }
  switchToApprovedHires(): void {
    this.hireSwitchForm = 1;
  }
  switchToNewHires(): void {
    this.hireSwitchForm = 2;
  }
  switchToEditHires(): void {
    this.hireSwitchForm = 3;
  }
  // Business Switches
  switchToBusinesses(): void {
    this.switchForm = 3;
  }
  switchToApprovedBusinesses(): void {
    this.businessSwitchForm = 1;
  }
  switchToNewBusiness(): void {
    this.businessSwitchForm = 2;
  }
  switchToEditBusiness(): void {
    this.businessSwitchForm = 3;
  }
  // Job Board Switches
  switchToJobBoard(): void {
    this.switchForm = 4;
  }
  switchToApprovedJobs(): void {
    this.jobSwitchForm = 1;
  }
  switchToNewJobs(): void {
    this.jobSwitchForm = 2;
  }
  switchToEditJobs(): void {
    this.jobSwitchForm = 3;
  }
  // ------------------------------- OPEN DIALOGS AND SUBMITS -------------------------------

  // close function that works for all dialogs
  closeDialog() {
    this.dialog.closeAll();
  }
}
