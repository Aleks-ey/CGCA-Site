import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { CalendarEvent } from './calendarEvent.model';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/components/login/login.component';
import { Subscription } from 'rxjs';
import { JobBoardListing } from '../job-board/job-board.component';
import { ForHireListing } from '../for-hire/for-hire.component';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  private sub!: Subscription;

  switchForm: number = 0;
  tempHiresList: ForHireListing[] = [];
  unapprovedHiresList: ForHireListing[] = [];
  approvedHiresList: ForHireListing[] = [];
  currentEmail: string = '';

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
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
    const result = await this.supabaseService.getAllEvents();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.eventsList = result.data!;
    }

    this.userEmail = await this.supabaseService.fetchUser();

    if(this.userEmail != null) {
      this.isLoggedIn = true;
    }
    else {
      this.isLoggedIn = false;
    }

    const result2 = await this.supabaseService.getAllHires();
    if (result2.error) {
      console.error('Error fetching events:', result2.error);
    } else {
      this.tempHiresList = result2.data!;
      for(let i = 0; i < this.tempHiresList.length; i++) {
        if(this.tempHiresList[i].approved == true) {
          this.approvedHiresList.push(this.tempHiresList[i]);
          // console.log(this.approvedHiresList);
        }
        if(this.tempHiresList[i].approved == false) {
          this.unapprovedHiresList.push(this.tempHiresList[i]);
          // console.log(this.unapprovedHiresList);
        }
      }
    }

    if (sessionStorage.getItem('callSwitchToApproveHires') === 'true') {
      this.switchToApproveHires();
      // Remove the flag from session storage
      sessionStorage.removeItem('callSwitchToApproveHires');
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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

  // openLoginDialog(): void {
  //   this.dialog.open(LoginComponent);
  // }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { isLoggedIn: this.isLoggedIn }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.isLoggedIn = result;
      if(this.isLoggedIn == true) {
        this.userEmail = this.supabaseService.fetchUser();
      }
    });
  }

  logout(): void {
    this.supabaseService.signOut();
    this.isLoggedIn = false;
  }

  switchToEvents(): void {
    this.switchForm = 1;
  }

  switchToApproveHires(): void {
    this.switchForm = 2;
  }

  openApprovalDialog(email: string): void {
    this.currentEmail = email;
    const dialogRef = this.dialog.open(this.dialogTemplate);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  submitApproval(email: string): void {
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
}
