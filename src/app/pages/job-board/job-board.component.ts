import { Component, OnInit } from "@angular/core";
import { SupabaseService } from "src/app/supabase.service";
import { JobBoardListing } from "src/app/models/jobBoardListing.model";
// import { LoginComponent } from 'src/app/components/login/login.component';
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-job-board",
  templateUrl: "./job-board.component.html",
  styleUrls: ["./job-board.component.css"],
})
export class JobBoardComponent {
  jobsList: JobBoardListing[] = [];
  userEmail: any;
  isLoggedIn = false;

  displayedJobsList: JobBoardListing[] = []; // Array for jobs to be displayed on current page
  searchQuery = "";
  currentPage = 1;
  pageSize = 10; // Number of jobs per page
  totalJobs = 0; // Total number of filtered jobs
  searchPerformed = false; // Has the user performed a search?

  constructor(
    private supabaseService: SupabaseService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.supabaseService.isLoggedIn().then((res) => {
      if (res === true) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });

    // fetch all jobs
    const allJobsData = await this.supabaseService.getAllJobs();
    if (allJobsData.error) {
      console.error("Error fetching events:", allJobsData.error);
    } else {
      this.jobsList = allJobsData.data!;
    }

    this.totalJobs = this.jobsList.length;
    this.updateDisplayedJobs();
  }

  updateDisplayedJobs() {
    // First, filter the jobs based on the search query
    let filteredJobs = this.jobsList.filter(
      (job) =>
        job.job_title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (this.searchQuery == "") {
      this.searchPerformed = false;
    }

    // Update total jobs with the length of filtered jobs
    this.totalJobs = filteredJobs.length;

    // Calculate the slice of jobs to be displayed based on the current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayedJobsList = filteredJobs.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to first page on search
    this.searchPerformed = true;
    this.updateDisplayedJobs();
  }

  get currentPageList(): JobBoardListing[] {
    // Calculate start and end index
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Return a slice of businessesList for the current page
    return this.jobsList.slice(startIndex, endIndex);
  }

  get pageNumbers(): number[] {
    const totalPages = this.totalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  totalPages() {
    return Math.ceil(this.totalJobs / this.pageSize);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedJobs();
    window.scrollTo(0, 0);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateDisplayedJobs();
      window.scrollTo(0, 0);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedJobs();
      window.scrollTo(0, 0);
    }
  }

  // openLoginDialog(): void {
  //   this.dialog.open(LoginComponent, {
  //     }
  //   );
  // }

  async logout() {
    await this.supabaseService.signOut();
    window.location.reload();
  }

  async navigateToAccount() {
    await this.supabaseService.isLoggedIn().then((res) => {
      if (res === true) {
        this.router.navigate(["/account"]);
      } else {
        this.router.navigate(["/account-login"]);
      }
    });
  }
}
