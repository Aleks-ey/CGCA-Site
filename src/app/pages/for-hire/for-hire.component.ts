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
    await this.supabaseService.isLoggedIn()
    .then (res => {
      if (res === true) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });

    // fetch all hires
    const allHiresData = await this.supabaseService.getAllHires();
    if (allHiresData.error) {
      console.error('Error fetching events:', allHiresData.error);
    } else {
      this.tempHiresList = allHiresData.data!;
      for(let i = 0; i < this.tempHiresList.length; i++) {
        if(this.tempHiresList[i].approved == true) {
          this.hiresList.push(this.tempHiresList[i]);
        }
      }
    }
  }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

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
