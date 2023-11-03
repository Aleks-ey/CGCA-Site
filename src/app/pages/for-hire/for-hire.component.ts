import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { ForHireRequestComponent } from 'src/app/components/for-hire-request/for-hire-request.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { ForHireListing } from 'src/app/components/for-hire-request/for-hire-request.component'

@Component({
  selector: 'app-for-hire',
  templateUrl: './for-hire.component.html',
  styleUrls: ['./for-hire.component.css'],
})
export class ForHireComponent {

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
        }
      }
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
    this.dialog.open(LoginComponent, {
      height: 'auto',
      width: '90%',
    }
      );
  }

  logout(): void {
    this.supabaseService.signOut();
  }
}
