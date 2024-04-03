import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Profile, SupabaseService } from 'src/app/supabase.service';
import { CalendarEvent } from './calendarEvent.model';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/components/login/login.component';
import { Subscription } from 'rxjs';
import { ForHireListing } from 'src/app/components/for-hire-request/for-hire-request.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BusinessListing } from 'src/app/components/register-business/register-business.component';

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
  };

  eventsList: CalendarEvent[] = [];
  selectedEventId?: number;

  isLoggedIn = false;
  userEmail: any;
  isAdmin = false;
  // private sub!: Subscription;

  switchForm: number = 0;
  tempHiresList: ForHireListing[] = [];
  unapprovedHiresList: ForHireListing[] = [];
  approvedHiresList: ForHireListing[] = [];
  currentEmail: string = '';

  tempBusinessList: Profile[] = [];
  approvedBusinessList: Profile[] = [];
  unapprovedBusinessList: Profile[] = [];

  @ViewChild('dialogTemplate1') dialogTemplate1!: TemplateRef<any>;
  @ViewChild('dialogTemplate2') dialogTemplate2!: TemplateRef<any>;
  toggleForm: FormGroup;

  constructor(
    private supabaseService: SupabaseService, 
    public dialog: MatDialog, 
    private fb: FormBuilder) 
    {
      this.toggleForm = this.fb.group({
        toggleValue: [false] // default value
      });
    }

  async onSubmit() {
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
        title: ''
      };
    }
  }

  async fetchEvents() {
    const { data, error } = await this.supabaseService.getAllEvents();
    if (error) {
      console.error('Error fetching events:', error);
    } else {
      this.eventsList = data || [];
    }
  }

  async ngOnInit() {
    // Initialize user profile data.
    let profileData: any;
    const userId = await this.supabaseService.fetchUserId();
    if (userId) {
      profileData = await this.supabaseService.getProfile(userId);
      this.userEmail = profileData.data?.email;
      if (this.userEmail == 'akhukhua@yahoo.com') {
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
    } else {
      this.tempHiresList = allHiresData.data!;
      for(let i = 0; i < this.tempHiresList.length; i++) {
        if(this.tempHiresList[i].approved == true) {
          this.approvedHiresList.push(this.tempHiresList[i]);
        }
        if(this.tempHiresList[i].approved == false) {
          this.unapprovedHiresList.push(this.tempHiresList[i]);
        }
      }
    }
    // fetch business accounts
    const allProfilesData = await this.supabaseService.getAllProfiles();
    if (allProfilesData.error) {
      console.error('Error fetching events:', allProfilesData.error);
    } else {
      this.tempBusinessList = allProfilesData.data!;
      for(let i = 0; i < this.tempBusinessList.length; i++) {
        if(this.tempBusinessList[i].business_acc == true) {
          this.approvedBusinessList.push(this.tempBusinessList[i]);
        }
      }
      for(let i = 0; i < this.tempBusinessList.length; i++) {
        if(this.tempBusinessList[i].business_request == true && this.tempBusinessList[i].business_acc == false) {
          this.unapprovedBusinessList.push(this.tempBusinessList[i]);
        }
      }
    }
    // fetch job board listings
    const allJobsData = await this.supabaseService.getAllJobs();
    if (allJobsData.error) {
      console.error('Error fetching events:', allJobsData.error);
    } else {
      console.log(allJobsData.data);
    }


    if (sessionStorage.getItem('callSwitchToApproveHires') === 'true') {
      this.switchToApproveHires();
      // Remove the flag from session storage
      sessionStorage.removeItem('callSwitchToApproveHires');
    }
    if (sessionStorage.getItem('callSwitchToApproveBusinessAccounts') === 'true') {
      this.switchToApproveBusinessAccounts();
      // Remove the flag from session storage
      sessionStorage.removeItem('callSwitchToApproveBusinessAccounts');
    }
  }

  async deleteEvent() {
    if (this.selectedEventId) {
      const result = await this.supabaseService.deleteEvent(
        this.selectedEventId
      );
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

  async openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.isLoggedIn = result;
      if(this.isLoggedIn == true) {
        window.location.reload();
      }
    });
  }

  async logout() {
    this.supabaseService.signOut();
    this.isLoggedIn = false;
    // reload window with small delay to allow signout to complete
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  switchToEvents(): void {
    this.switchForm = 1;
  }

  switchToApproveHires(): void {
    this.switchForm = 2;
  }

  switchToApproveBusinessAccounts(): void {
    this.switchForm = 3;
  }

  async openApprovalDialog(email: string) {
    this.currentEmail = email;
    const dialogRef = this.dialog.open(this.dialogTemplate1, {
        height: 'auto',
        width: '80%',
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async submitApproval(email: string) {
    const toggleValue = this.toggleForm.get('toggleValue')!.value;
    console.log('Toggle value:', toggleValue);

    // Call your backend service to update the row in your table
    this.supabaseService.updateHiresApprovedRow(email,toggleValue) // Replace with your actual method name and adjust as needed
      .then(response => {
        console.log('Updated successfully:', response);
        this.closeDialog();
        
        sessionStorage.setItem('callSwitchToApproveHires', 'true');

        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating:', error);
      });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  async openBusinessApprovalDialog(email: string) {
    this.currentEmail = email;
    const dialogRef = this.dialog.open(this.dialogTemplate2, {
        height: 'auto',
        width: '80%',
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async submitBusinessApproval(email: string) {
    const toggleValue = this.toggleForm.get('toggleValue')!.value;
    console.log('Toggle value:', toggleValue);

    this.supabaseService.updateBusinessApprovedRow(email,toggleValue)
      .then(response => {
        console.log('Updated successfully:', response);
        this.closeDialog();
        
        sessionStorage.setItem('callSwitchToApproveBusinessAccounts', 'true');

        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating:', error);
      });
  }
}
