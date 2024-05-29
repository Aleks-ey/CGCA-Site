import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Profile, SupabaseService } from 'src/app/supabase.service';
import { CalendarEvent } from '../events/calendarEvent.model';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/components/login/login.component';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ForHireListing } from 'src/app/components/for-hire-request/for-hire-request.component';
import { BusinessListing } from 'src/app/components/register-business/register-business.component';
import { JobBoardListing } from 'src/app/components/register-job-board/register-job-board.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  event: CalendarEvent = {
    date: '',
    description: '',
    time: '',
    title: '',
    image_url: '',
  };

  eventsList: CalendarEvent[] = [];
  selectedEventId?: number;

  isLoggedIn = false;
  userEmail: any;
  isAdmin = false;
  userId = '';
  // private sub!: Subscription;

  switchForm: number = 0;
  hireSwitchForm: number = 0;
  businessSwitchForm: number = 0;
  jobSwitchForm: number = 0;
  // hire lists
  tempHiresList: ForHireListing[] = [];
  approvedHiresList: ForHireListing[] = [];
  unapprovedHiresList: ForHireListing[] = [];
  editHiresList: ForHireListing[] = [];
  // business lists
  tempBusinessList: BusinessListing[] = [];
  approvedBusinessList: BusinessListing[] = [];
  unapprovedBusinessList: BusinessListing[] = [];
  editBusinessList: BusinessListing[] = [];
  // job board lists
  tempJobsList: JobBoardListing[] = [];
  approvedJobsList: JobBoardListing[] = [];
  unapprovedJobsList: JobBoardListing[] = [];
  editJobsList: JobBoardListing[] = [];

  @ViewChild('dialogNewHires') dialogNewHires!: TemplateRef<any>;
  @ViewChild('dialogNewBusiness') dialogNewBusiness!: TemplateRef<any>;
  @ViewChild('dialogNewJobs') dialogNewJobs!: TemplateRef<any>;
  toggleForm: FormGroup;

  constructor(
    private supabaseService: SupabaseService, 
    public dialog: MatDialog, 
    private fb: FormBuilder
  ) 
  {
    this.toggleForm = this.fb.group({
      toggleValue: [false] // default value
    });
  }

  async ngOnInit() {
    // Initialize user profile data.
    let profileData: any;
    this.userId = await this.supabaseService.fetchUserId() as string;
    if (this.userId) {
      this.isLoggedIn = true;
      profileData = await this.supabaseService.getProfile(this.userId);
      this.userEmail = profileData.data?.email;
      if (this.userEmail == 'admin@admin.com') {
        this.isAdmin = true;
      }
    }
    // fetch events
    const allEventsData = await this.supabaseService.getAllEvents();
    if (allEventsData.error) {
      console.error('Error fetching events:', allEventsData.error);
    } else {
      this.eventsList = allEventsData.data!;
    }
    // fetch hires
    const allHiresData = await this.supabaseService.getAllHires();
    if (allHiresData.error) {
      console.error('Error fetching events:', allHiresData.error);
    } 
    else {
      this.tempHiresList = allHiresData.data!;
      for(let i = 0; i < this.tempHiresList.length; i++) {
        if(this.tempHiresList[i].approved == true) {
          this.approvedHiresList.push(this.tempHiresList[i]);
        }
        else {
          this.unapprovedHiresList.push(this.tempHiresList[i]);
        }
      }
    }
    // fetch business listings
    const allBusinessData = await this.supabaseService.getAllBusiness();
    if (allBusinessData.error) {
      console.error('Error fetching events:', allBusinessData.error);
    } 
    else {
      this.tempBusinessList = allBusinessData.data!;
      for(let i = 0; i < this.tempBusinessList.length; i++) {
        if(this.tempBusinessList[i].approved == true) {
          this.approvedBusinessList.push(this.tempBusinessList[i]);
        }
        else {
          this.unapprovedBusinessList.push(this.tempBusinessList[i]);
        }
      }
    }
    // fetch job board listings
    const allJobsData = await this.supabaseService.getAllJobs();
    if (allJobsData.error) {
      console.error('Error fetching events:', allJobsData.error);
    }
    else {
      this.tempJobsList = allJobsData.data!;
      for(let i = 0; i < this.tempJobsList.length; i++) {
        if(this.tempJobsList[i].approved == true) {
          this.approvedJobsList.push(this.tempJobsList[i]);
        }
        else {
          this.unapprovedJobsList.push(this.tempJobsList[i]);
        }
      }
    }
    // fetch all for hire edit listings
    const allEditHiresData = await this.supabaseService.getAllHireEdits();
    if (allEditHiresData.error) { console.error('Error fetching events:', allEditHiresData.error); }
    else { this.editHiresList = allEditHiresData.data!; }
    // fetch all business edit listings
    const allEditBusinessData = await this.supabaseService.getAllBusinessEdits();
    if (allEditBusinessData.error) { console.error('Error fetching events:', allEditBusinessData.error); }
    else { this.editBusinessList = allEditBusinessData.data!; }
    // fetch all job board edit listings
    const allEditJobsData = await this.supabaseService.getAllJobEdits();
    if (allEditJobsData.error) { console.error('Error fetching events:', allEditJobsData.error); }
    else { this.editJobsList = allEditJobsData.data!; }
    // Check if there are any flags set in session storage to switch to a specific form
    if (sessionStorage.getItem('callSwitchToHires') === 'true') {
      this.switchToHires();
      // Remove the flag from session storage
      sessionStorage.removeItem('callSwitchToHires');
    }
    if (sessionStorage.getItem('callSwitchToBusinesses') === 'true') {
      this.switchToBusinesses();
      // Remove the flag from session storage
      sessionStorage.removeItem('callSwitchToBusinesses');
    }
    if (sessionStorage.getItem('callSwitchToJobBoard') === 'true') {
      this.switchToJobBoard();
      // Remove the flag from session storage
      sessionStorage.removeItem('callSwitchToJobBoard');
    }
  }
  // Upload image
  private file: File | null = null;
  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }
  async upload() {
    if (!this.file) {
      alert('Please select a file first.');
      return;
    }
    try {
      const url = await this.supabaseService.uploadFile(`admin/assets/${this.file.name}`, this.file);
      alert('File uploaded successfully: ' + url);
      return url;
    } catch (error) {
      console.error('Upload error', error);
      return null;
    }
  }
  // Add event
  async submitEvent() {
    const url = await this.upload();
    console.log('URL:', url);
    if(url) {
      this.event.image_url = url;
      const result = await this.supabaseService.addEvent(this.event);
      if (result.error) {
        console.error('Error inserting data:', result.error);
      } else {
        console.log('Event added successfully!');
        await this.fetchEvents();
        this.event = {
          date: '',
          description: '',
          time: '',
          title: '',
          image_url: '',
        };
      }
    } else {
      console.error('Error uploading image');
    }
  }
  // Fetch events
  async fetchEvents() {
    const { data, error } = await this.supabaseService.getAllEvents();
    if (error) { console.error('Error fetching events:', error); } 
    else { this.eventsList = data || []; }
  }
  // Delete event
  async deleteEvent() {
    if (this.selectedEventId) {
      const result = await this.supabaseService.deleteEvent( this.selectedEventId );
      if (result.error) {
        console.error('Error deleting event:', result.error);
      } else {
        console.log('Event deleted successfully!');
        // Remove the deleted event from the eventsList
        this.eventsList = this.eventsList.filter(event => event.id !== this.selectedEventId);
        this.selectedEventId = undefined;
      }
    }
  }
  // Open login dialog
  async openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, { });
    dialogRef.afterClosed().subscribe(result => {
      this.isLoggedIn = result;
      if(this.isLoggedIn == true) { window.location.reload(); }
    });
  }
  // Logout function
  async logout() {
    this.supabaseService.signOut();
    this.isLoggedIn = false;
    // reload window with small delay to allow signout to complete
    setTimeout(() => { window.location.reload(); }, 100);
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
  
  // Open new hire approval dialog
  async openHiresApproval(uuid : string, email: string) {
    this.userId = uuid;
    this.userEmail = email;
    // Determine if the hire is approved
    const isApproved = this.approvedHiresList.some(hire => hire.profile_id === uuid);
    // Set the toggle value based on approval status
    this.toggleForm.get('toggleValue')?.setValue(isApproved);
    const dialogRef = this.dialog.open(this.dialogNewHires, {
        height: 'auto',
        width: '80%',
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  // Submit new hire approval
  async submitHiresApproval(uuid: string) {
    const toggleValue = this.toggleForm.get('toggleValue')!.value;
    // Call your backend service to update the row in your table
    this.supabaseService.updateHiresApproved(uuid,toggleValue) // Replace with your actual method name and adjust as needed
      .then(response => {
        console.log('Updated successfully:', response);
        this.closeDialog();
        // Set a flag in session storage to switch to the hires form after the page reloads
        sessionStorage.setItem('callSwitchToHires', 'true');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating:', error);
      });
  }
  // submit hire edit
  async submitHireEdit(uuid: string) {
    this.supabaseService.updateHiresEditApproved(uuid)
      .then(response => {
        this.supabaseService.replaceForHire(uuid)
          .then(response => {
            console.log('Updated successfully:', response);
            this.closeDialog();
            // Set a flag in session storage to switch to the hires form after the page reloads
            sessionStorage.setItem('callSwitchToHires', 'true');
            window.location.reload();
          })
          .catch(error => {
            console.error('Error updating:', error);
          });
      })
      .catch(error => {
        console.error('Error updating:', error);
      });
  }
  // Open new business approval dialog
  async openBusinessesApproval(uuid: string, email: string) {
    this.userId = uuid;
    this.userEmail = email;
    // Determine if the business is approved
    const isApproved = this.approvedBusinessList.some(business => business.profile_id === uuid);
    // Set the toggle value based on approval status
    this.toggleForm.get('toggleValue')?.setValue(isApproved);
    const dialogRef = this.dialog.open(this.dialogNewBusiness, {
        height: 'auto',
        width: '80%',
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  // Submit business approval
  async submitBusinessesApproval(uuid: string) {
    const toggleValue = this.toggleForm.get('toggleValue')!.value;
    this.supabaseService.updateBusinessApproved(uuid,toggleValue)
      .then(response => {
        console.log('Updated successfully:', response);
        this.closeDialog();
        // Set a flag in session storage to switch to the businesses form after the page reloads
        sessionStorage.setItem('callSwitchToBusinesses', 'true');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating:', error);
      });
  }
  // submit business edit
  async submitBusinessEdit(uuid: string) {
    this.supabaseService.updateBusinessEditApproved(uuid)
      .then(response => {
        this.supabaseService.replaceBusiness(uuid)
          .then(response => {
            console.log('Updated successfully:', response);
            this.closeDialog();
            // Set a flag in session storage to switch to the businesses form after the page reloads
            sessionStorage.setItem('callSwitchToBusinesses', 'true');
            window.location.reload();
          })
          .catch(error => {
            console.error('Error updating:', error);
          });
      })
      .catch(error => {
        console.error('Error updating:', error);
      });
  }
  // Open new job approval dialog
  async openJobsApproval(uuid: string, email: string) {
    this.userId = uuid;
    this.userEmail = email;
    // Determine if the job is approved
    const isApproved = this.approvedJobsList.some(job => job.profile_id === uuid);
    // Set the toggle value based on approval status
    this.toggleForm.get('toggleValue')?.setValue(isApproved);
    const dialogRef = this.dialog.open(this.dialogNewJobs, {
        height: 'auto',
        width: '80%',
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  // Submit job approval
  async submitJobsApproval(uuid: string) {
    const toggleValue = this.toggleForm.get('toggleValue')!.value;
    this.supabaseService.updateJobBoardApproved(uuid,toggleValue)
      .then(response => {
        console.log('Updated successfully:', response);
        this.closeDialog();
        // Set a flag in session storage to switch to the job board form after the page reloads
        sessionStorage.setItem('callSwitchToJobBoard', 'true');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating:', error);
      });
  }
  // submit job edit
  async submitJobEdit(uuid: string) {
    this.supabaseService.updateJobBoardEditApproved(uuid)
      .then(response => {
        this.supabaseService.replaceJobBoard(uuid)
          .then(response => {
            console.log('Updated successfully:', response);
            this.closeDialog();
            // Set a flag in session storage to switch to the job board form after the page reloads
            sessionStorage.setItem('callSwitchToJobBoard', 'true');
            window.location.reload();
          })
          .catch(error => {
            console.error('Error updating:', error);
          });
      })
      .catch(error => {
        console.error('Error updating:', error);
      });
  }
  // close function that works for all dialogs
  closeDialog() {
    this.dialog.closeAll();
  }
}
