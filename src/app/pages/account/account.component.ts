import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForHireListing, ForHireRequestComponent } from 'src/app/components/for-hire-request/for-hire-request.component';
import { BusinessListing, RegisterBusinessComponent } from 'src/app/components/register-business/register-business.component';
import { JobBoardListing, RegisterJobBoardComponent } from 'src/app/components/register-job-board/register-job-board.component';
import { UpdateAccountComponent } from 'src/app/components/update-account/update-account.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  loginForm!: FormGroup;

  userEmail: any;
  userName: any = '';
  userPhone: any = '';
  isLoggedIn = false;

  userHireListing: ForHireListing[] = [];
  hasHireListing = false;
  hasForHireRequest = false;

  userBusiness: BusinessListing[] = [];
  hasBusinessListing = false;
  hasBusinessRequest = false;
  
  userJobBoardListing: JobBoardListing[] = [];
  hasJobBoardListing = false;
  hasJobBoardRequest = false;

  constructor(
    private supabaseService: SupabaseService,
    public dialog: MatDialog,
    private auth: SupabaseService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: formBuilder.control('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: formBuilder.control('', [Validators.required, Validators.minLength(6)]),
    });
  }

  async ngOnInit() {
    // Initialize user profile data.
    let profileData: any;
    const userId = await this.supabaseService.fetchUserId();
    // If userId is not null, then fetch the profile and relevant data.
    if (userId) {
      profileData = await this.supabaseService.getProfile(userId);
      this.userName = profileData.data?.name;
      this.userPhone = profileData.data?.phone_number;
      this.userEmail = profileData.data?.email;
      // Fetch the user's hire listing.
      const userHiresData = await this.supabaseService.getUserHires(userId);
      if (userHiresData.error) {
        console.error('Error fetching events:', userHiresData.error);
      } 
      else {
        this.userHireListing = userHiresData.data!;
        if(this.userHireListing.length > 0) {
          if(this.userHireListing[0].approved == true) {
            this.hasHireListing = true;
          }
          else {
            this.hasForHireRequest = true;
          }
        }
      }
      // Fetch the user's business listing.
      const userBusinessData = await this.supabaseService.getUserBusiness(userId);
      if (userBusinessData.error) {
        console.error('Error fetching events:', userBusinessData.error);
      } 
      else {
        this.userBusiness = userBusinessData.data!;
        if(this.userBusiness.length > 0) {
          if(this.userBusiness[0].approved == true) {
            this.hasBusinessListing = true;
          }
          else {
            this.hasBusinessRequest = true;
          }
        }
      }
      // Fetch the user's job board listing.
      const userJobsData = await this.supabaseService.getUserJobs(userId);
      if (userJobsData.error) {
        console.error('Error fetching events:', userJobsData.error);
      } 
      else {
        this.userJobBoardListing = userJobsData.data!;
        if(this.userJobBoardListing.length > 0) {
          if(this.userJobBoardListing[0].approved == true) {
            this.hasJobBoardListing = true;
          }
          else {
            this.hasJobBoardRequest = true;
          }
        }
      }
    }
    else {
      // Handle the case when there is no user logged in.
      console.error('No user is logged in.');
    }
  }

  async logout() {
    await this.supabaseService.signOut();
    setTimeout (() => {this.router.navigate(['/account-login']), 1000});
  }

  // --------------------------------- USER INFO ---------------------------------
  formatPhone(userPhone: any): string {
    if (typeof userPhone === 'string') {
      return `(${userPhone.slice(0,3)}) ${userPhone.slice(3,6)}-${userPhone.slice(6,10)}`;
    } else {
      return 'Invalid phone number'; // or any other fallback logic you want
    }
  }
  // update username
  newName='';
  public updateUserName(newName: string) {
    if(newName != '') {
      this.supabaseService.updateProfileName(this.userEmail, newName);
      setTimeout(() => {window.location.reload(), 3000});
    }
  }
  // update phone number
  newPhone='';
  public updateUserPhone(newPhone: string) {
    console.log(newPhone);
    if(newPhone.length == 10) {
      this.supabaseService.updateProfilePhone(this.userEmail, newPhone);
      setTimeout(() => {window.location.reload(), 3000});
    }
  }
  // update email
  newEmail='';
  public updateUserEmail(newEmail: string) {
    if(newEmail != '') {
      this.supabaseService.updateProfileEmail(newEmail);
      setTimeout(() => {window.location.reload(), 3000});
    }
  }
  // update password dialog inits
  @ViewChild('dialogPasswordUpdateSuccess') dialogPasswordUpdateSuccess!: TemplateRef<any>;
  @ViewChild('dialogPasswordUpdateFail') dialogPasswordUpdateFail!: TemplateRef<any>;
  // update password
  newPassword='';
  async updateUserPassword(newPassword: string) {
    if(newPassword != '') {
      const check = await this.supabaseService.updateProfilePassword(newPassword);
      if(check) {
        const dialogRef = this.dialog.open(this.dialogPasswordUpdateSuccess);
        setTimeout(() => {window.location.reload(), 4000});
      }
      else {
        const dialogRef = this.dialog.open(this.dialogPasswordUpdateFail);
      }
    }
  }
  // --------------------------------- EDITS ---------------------------------
  openEditAccountDialog(): void {
    const dialogRef = this.dialog.open(UpdateAccountComponent, {
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEditHireDialog(): void {
    const dialogRef = this.dialog.open(ForHireRequestComponent, {
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEditBusinessDialog(): void {
    const dialogRef = this.dialog.open(RegisterBusinessComponent, {
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEditJobBoardDialog(): void {
    const dialogRef = this.dialog.open(RegisterJobBoardComponent, {
      // height: 'auto',
      // width: '80%',
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // ----------------- Delete -----------------

  @ViewChild('dialogDeleteForHire') dialogDeleteForHire!: TemplateRef<any>;
  openDeleteForHireDialog(): void {
    const dialogRef = this.dialog.open(this.dialogDeleteForHire);
  }

  @ViewChild('dialogDeleteForHireSuccess') dialogDeleteForHireSuccess!: TemplateRef<any>;
  @ViewChild('dialogDeleteForHireFail') dialogDeleteForHireFail!: TemplateRef<any>;
  async deleteForHire() {
    const userId = await this.supabaseService.fetchUserId();
    if (userId) {
      const check = await this.supabaseService.deleteForHireListing(userId);
      if(check) {
        const dialogRef = this.dialog.open(this.dialogDeleteForHireSuccess);
        setTimeout(() => {window.location.reload(), 3000});
      }
      else {
        const dialogRef = this.dialog.open(this.dialogDeleteForHireFail);
      }
    }
    else {
      console.error('User ID is null.');
    }
  }

  @ViewChild('dialogDeleteBusiness') dialogDeleteBusiness!: TemplateRef<any>;
  openDeleteBusinessDialog(): void {
    const dialogRef = this.dialog.open(this.dialogDeleteBusiness);
  }

  @ViewChild('dialogDeleteBusinessSuccess') dialogDeleteBusinessSuccess!: TemplateRef<any>;
  @ViewChild('dialogDeleteBusinessFail') dialogDeleteBusinessFail!: TemplateRef<any>;
  async deleteBusiness() {
    const userId = await this.supabaseService.fetchUserId();
    if (userId) {
      const check = await this.supabaseService.deleteBusinessListing(userId);
      if(check) {
        const dialogRef = this.dialog.open(this.dialogDeleteBusinessSuccess);
        setTimeout(() => {window.location.reload(), 3000});
      }
      else {
        const dialogRef = this.dialog.open(this.dialogDeleteBusinessFail);
      }
    }
    else {
      console.error('User ID is null.');
    }
  }

  @ViewChild('dialogDeleteJobBoard') dialogDeleteJobBoard!: TemplateRef<any>;
  openDeleteJobBoardDialog(): void {
    const dialogRef = this.dialog.open(this.dialogDeleteJobBoard);
  }

  @ViewChild('dialogDeleteJobBoardSuccess') dialogDeleteJobBoardSuccess!: TemplateRef<any>;
  @ViewChild('dialogDeleteJobBoardFail') dialogDeleteJobBoardFail!: TemplateRef<any>;
  async deleteJobBoardListing() {
    const userId = await this.supabaseService.fetchUserId();
    if (userId) {
      const check = await this.supabaseService.deleteJobBoardListing(userId);
      if(check) {
        const dialogRef = this.dialog.open(this.dialogDeleteJobBoardSuccess);
        setTimeout(() => {window.location.reload(), 3000});
      }
      else {
        const dialogRef = this.dialog.open(this.dialogDeleteJobBoardFail);
      }
    }
    else {
      console.error('User ID is null.');
    }
  }
}
