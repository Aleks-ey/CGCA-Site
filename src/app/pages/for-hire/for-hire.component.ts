import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { ForHireRequestComponent } from 'src/app/components/for-hire-request/for-hire-request.component';
import { Subscription } from 'rxjs';
import { LoginComponent } from 'src/app/components/login/login.component';

export interface ForHireListing {
  id?: number;
  name: string;
  profession: string;
  about: string;
  email: string;
  phone_number: string;
  location: string;
  work_outside: boolean;
  approved: boolean;
}

@Component({
  selector: 'app-for-hire',
  templateUrl: './for-hire.component.html',
  styleUrls: ['./for-hire.component.css'],
})
export class ForHireComponent {
  listing: ForHireListing = {
    name: '',
    profession: '',
    about: '',
    email: '',
    phone_number: '',
    location: '',
    work_outside: false,
    approved: false,
  };

  tempHiresList: ForHireListing[] = [];
  hiresList: ForHireListing[] = [];
  workOutside: boolean = false;
  userEmail: any;
  isLoggedIn = false;
  // private sub!: Subscription;

  constructor(private supabaseService: SupabaseService, public dialog: MatDialog) {}

  async ngOnInit() {
    const result = await this.supabaseService.getAllHires();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.tempHiresList = result.data!;
      for(let i = 0; i < this.tempHiresList.length; i++) {
        if(this.tempHiresList[i].approved == true) {
          this.hiresList.push(this.tempHiresList[i]);
          // console.log(this.hiresList);
        }
      }
    }

    this.userEmail = await this.supabaseService.fetchUser();

    if(this.userEmail != null) {
      this.isLoggedIn = true;
    }
  }

  openForHireDialog(): void {
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
