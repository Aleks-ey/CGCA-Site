import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { BusinessListing } from 'src/app/components/register-business/register-business.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
})
export class BusinessComponent implements OnInit {
  listing: BusinessListing = {
    company_name: '',
    type: '',
    description: '',
    owner: '',
    email: '',
    phone_number: '',
    location: '',
    image_url: '',
  };

  businessesList: BusinessListing[] = []; // Holds all businesses
  userEmail: any; // Holds the user's email
  isLoggedIn = false; // Is the user logged in?

  allBusinessesList: BusinessListing[] = [];
  displayedBusinessesList: BusinessListing[] = [];
  searchQuery = ''; // Holds the search query
  currentPage = 1; // Current page index
  pageSize = 10; // Number of businesses per page
  totalBusinesses = 0; // Total number of businesses
  searchPerformed = false; // Has the user performed a search?

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

    // fetch all businesses
    const allBusinesses = await this.supabaseService.getAllBusinesses();
    if (allBusinesses.error) {
      console.error('Error fetching events:', allBusinesses.error);
    } else {
      this.businessesList = allBusinesses.data!;
    }

    this.allBusinessesList = [...this.businessesList];
    this.totalBusinesses = this.allBusinessesList.length;
    this.updateDisplayedBusinesses();
  }

  updateDisplayedBusinesses() {
    let filteredBusinesses = this.allBusinessesList;
    
    if (this.searchQuery) {
      filteredBusinesses = filteredBusinesses.filter((business) =>
        business.company_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.searchQuery == '') {
      this.searchPerformed = false;
    }

    this.totalBusinesses = filteredBusinesses.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayedBusinessesList = filteredBusinesses.slice(startIndex, startIndex + this.pageSize);
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to the first page when search changes
    this.searchPerformed = true;
    this.updateDisplayedBusinesses();
  }

  get currentPageList(): BusinessListing[] {
    // Calculate start and end index
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Return a slice of businessesList for the current page
    return this.businessesList.slice(startIndex, endIndex);
  }

  get pageNumbers(): number[] {
    const totalPages = this.totalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  } 
  
  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedBusinesses();
    window.scrollTo(0, 0);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateDisplayedBusinesses();
      window.scrollTo(0, 0);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedBusinesses();
      window.scrollTo(0, 0);
    }
  }

  totalPages() {
    return Math.ceil(this.totalBusinesses / this.pageSize);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  async logout() {
    await this.supabaseService.signOut();
    window.location.reload();
  }

  async navigateToAccount() {
    await this.supabaseService.isLoggedIn() 
    .then (res => {
      if (res === true) {
        this.router.navigate(['/account']);
      } else {
        this.router.navigate(['/account-login']);
      }
    });
  }
}
