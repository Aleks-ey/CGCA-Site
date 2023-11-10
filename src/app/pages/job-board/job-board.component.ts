import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { JobBoardListing } from 'src/app/components/register-job-board/register-job-board.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.css'],
})
export class JobBoardComponent {

  jobsList: JobBoardListing[] = [];
  userEmail: any;
  isLoggedIn = false;

  constructor(private supabaseService: SupabaseService, public dialog: MatDialog) {}

  async ngOnInit() {
    const result = await this.supabaseService.getAllJobs();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.jobsList = result.data!;
    }

    this.userEmail = await this.supabaseService.fetchUserEmail();

    if(this.userEmail != null) {
      this.isLoggedIn = true;
    }
  }

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
        height: 'auto',
        width: '90%',
      }
      );
  }

  logout(): void {
    this.supabaseService.signOut();
    // refresh page with delay to allow for signout to complete
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}
