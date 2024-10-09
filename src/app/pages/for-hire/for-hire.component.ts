import { Component, OnInit } from "@angular/core";
import { SupabaseService } from "src/app/supabase.service";
import { MatDialog } from "@angular/material/dialog";
import { MatInput } from "@angular/material/input";
import { ForHireRequestComponent } from "src/app/components/for-hire-request/for-hire-request.component";
// import { LoginComponent } from 'src/app/components/login/login.component';
import { ForHireListing } from "src/app/models/forHireListing.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-for-hire",
  templateUrl: "./for-hire.component.html",
  styleUrls: ["./for-hire.component.css"],
})
export class ForHireComponent {
  tempHiresList: ForHireListing[] = [];
  hiresList: ForHireListing[] = [];
  workOutside: boolean = false;
  userEmail: any;
  isLoggedIn = false;
  // private sub!: Subscription;

  searchQuery = "";
  currentPage = 1;
  pageSize = 10; // Number of hires per page
  totalHires = 0; // Total number of filtered hires
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

    // fetch all hires
    const allHiresData = await this.supabaseService.getAllHires();
    if (allHiresData.error) {
      console.error("Error fetching events:", allHiresData.error);
    } else {
      this.tempHiresList = allHiresData.data!;
      for (let i = 0; i < this.tempHiresList.length; i++) {
        if (this.tempHiresList[i].approved == true) {
          this.hiresList.push(this.tempHiresList[i]);
        }
      }
    }

    this.totalHires = this.hiresList.length;
    this.updateDisplayedHires();
  }

  updateDisplayedHires() {
    // Filter the hires based on the search query
    let filteredHires = this.searchQuery
      ? this.hiresList.filter(
          (hire) =>
            hire.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            hire.profession
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
        )
      : this.hiresList;

    if (this.searchQuery == "") {
      this.searchPerformed = false;
    }

    // Update total hires
    this.totalHires = filteredHires.length;

    // Calculate the slice of hires to be displayed
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.tempHiresList = filteredHires.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to first page
    this.searchPerformed = true;
    this.updateDisplayedHires();
  }

  get currentPageList(): ForHireListing[] {
    // Calculate start and end index
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Return a slice of businessesList for the current page
    return this.hiresList.slice(startIndex, endIndex);
  }

  get pageNumbers(): number[] {
    const totalPages = this.totalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  totalPages() {
    return Math.ceil(this.totalHires / this.pageSize);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedHires();
    // scroll to top of page
    window.scrollTo(0, 0);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateDisplayedHires();
      window.scrollTo(0, 0);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedHires();
      window.scrollTo(0, 0);
    }
  }

  // openLoginDialog(): void {
  //   this.dialog.open(LoginComponent, {
  //   }
  //     );
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
