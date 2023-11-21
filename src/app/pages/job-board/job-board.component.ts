import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { JobBoardListing } from 'src/app/components/register-job-board/register-job-board.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.css'],
})
export class JobBoardComponent {

  jobsList: JobBoardListing[] = [];
  userEmail: any;
  isLoggedIn = false;

  constructor(
    private supabaseService: SupabaseService,
    public dialog: MatDialog,
    private router: Router,
    ) {}

  async ngOnInit() {
    await this.supabaseService.isLoggedIn()
    .then (res => {
      if (res === true) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });

    // fetch all jobs
    const allJobsData = await this.supabaseService.getAllJobs();
    if (allJobsData.error) {
      console.error('Error fetching events:', allJobsData.error);
    } else {
      this.jobsList = allJobsData.data!;
    }
  }

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      }
    );
  }

  async logout() {
    await this.supabaseService.signOut();
    window.location.reload();
  }
}
