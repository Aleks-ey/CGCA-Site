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

  constructor(private supabaseService: SupabaseService, public dialog: MatDialog) {}

  async ngOnInit() {
    const result = await this.supabaseService.getAllBusinesses();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.businessesList = result.data!;
    }

    this.userEmail = await this.supabaseService.fetchUserEmail();

    if(this.userEmail != null) {
      this.isLoggedIn = true;
    }
  }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { isLoggedIn: this.isLoggedIn },
      height: 'auto',
      width: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isLoggedIn = result;
      if(this.isLoggedIn == true) {
        this.userEmail = this.supabaseService.fetchUserEmail();
        window.location.reload();
      }
    });
  }

  logout(): void {
    this.supabaseService.signOut();
    // refresh page with delay to allow for signout to complete
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}
