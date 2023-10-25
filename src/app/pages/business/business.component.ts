import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { ForHireRequestComponent } from 'src/app/components/for-hire-request/for-hire-request.component';
import { Subscription } from 'rxjs';
import { LoginComponent } from 'src/app/components/login/login.component';

export interface BusinessListing {
  id?: number;
  company_name: string;
  type: string;
  description: string;
  owner: string;
  email: string;
  phone_number: string;
  location: string;
}

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
})
export class BusinessComponent {
  listing: BusinessListing = {
    company_name: '',
    type: '',
    description: '',
    owner: '',
    email: '',
    phone_number: '',
    location: '',
  };

  businessesList: BusinessListing[] = [];
  workOutside: boolean = false;
  userEmail: any;
  isLoggedIn = false;

  constructor(private supabaseService: SupabaseService, public dialog: MatDialog) {}

  async ngOnInit() {
    const result = await this.supabaseService.getAllBusinesses();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.businessesList = result.data!;
    }

    this.userEmail = await this.supabaseService.fetchUser();

    if(this.userEmail != null) {
      this.isLoggedIn = true;
    }
  }

  openBusinessDialog(): void {
    this.dialog.open(ForHireRequestComponent);
  }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  openLoginDialog(): void {
    this.dialog.open(LoginComponent);
  }

  navigateToUserProfile(): void {
    // Navigation logic...
  }

  logout(): void {
    this.supabaseService.signOut();
  }
}
