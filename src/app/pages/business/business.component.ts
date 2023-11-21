import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { BusinessListing } from 'src/app/components/register-business/register-business.component';
import { LoginComponent } from 'src/app/components/login/login.component';


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
    image_url: '',
  };

  businessesList: BusinessListing[] = [];
  workOutside: boolean = false;
  userEmail: any;
  isLoggedIn = false;

  constructor(
    private supabaseService: SupabaseService,
    public dialog: MatDialog
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
}
