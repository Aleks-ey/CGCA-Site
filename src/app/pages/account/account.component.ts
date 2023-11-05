import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForHireListing } from 'src/app/components/for-hire-request/for-hire-request.component';
import { BusinessListing } from 'src/app/components/register-business/register-business.component';
import { JobBoardListing } from 'src/app/components/register-job-board/register-job-board.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  loginForm!: FormGroup;

  userEmail: any;
  userName: any;
  userPhone: any;
  isLoggedIn = false;
  isBusiness = false;

  userHireListing: ForHireListing[] = [];
  hasHireListing = false;
  hasForHireRequest = false;

  userBusiness: BusinessListing[] = [];
  hasBusinessRequest = false;
  hasBusinessListing = false;
  
  userJobBoardListing: JobBoardListing[] = [];
  hasJobBoardListing = false;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private supabaseService: SupabaseService,
    public dialog: MatDialog,
    private auth: SupabaseService,
    private formBuilder: FormBuilder,
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
    this.userEmail = await this.supabaseService.fetchUserEmail();
    await this.supabaseService.profile(this.userEmail)?.then(
        (res) => { 
          this.userName = res.data?.name 
          this.userPhone = res.data?.phone_number}
      );

    if(this.userEmail != null) {
      this.isLoggedIn = true;
      this.isBusiness = await this.supabaseService.checkBusinessAcc(this.userEmail);

      if(!this.isBusiness) {
        const result = await this.supabaseService.getUserHires(this.userEmail);
        if (result.error) {
          console.error('Error fetching events:', result.error);
        } 
        else {
          this.userHireListing = result.data!;
          if(this.userHireListing.length > 0) {
            this.hasHireListing = true;
          }
        }
        this.hasBusinessRequest = await this.supabaseService.checkBusinessRequest(this.userEmail);
        this.hasForHireRequest = await this.supabaseService.checkForHireRequest(this.userEmail);
      }
      else {
        const result2 = await this.supabaseService.getUserBusiness(this.userEmail);
        if (result2.error) {
          console.error('Error fetching events:', result2.error);
        } 
        else {
          this.userBusiness = result2.data!;
          if(this.userBusiness.length > 0) {
            this.hasBusinessListing = true;
          }
        }

        const result3 = await this.supabaseService.getUserJobs(this.userEmail);
        if (result3.error) {
          console.error('Error fetching events:', result3.error);
        } 
        else {
          this.userJobBoardListing = result3.data!;
          if(this.userJobBoardListing.length > 0) {
            this.hasJobBoardListing = true;
          }
        }
      }

    }
    else {
      this.isLoggedIn = false;
    }
  }

  // ----------------- Login -----------------

  public onLoginSubmit() {
    console.log(this.loginForm.value);
    this.auth
      .signIn(this.loginForm.value.email, this.loginForm.value.password)
      .then((res) => {
        console.log(res.data.user.role);
        if (res.data.user.role === 'authenticated') {
          console.log(this.supabaseService.fetchUserEmail());
          window.location.reload();
          // this.router.navigate(['/dashboard']);
        }
      })
      .catch((err) => {
        const dialogRef = this.dialog.open(this.dialogTemplate);
        console.log(err);
      });
  }

  async logout() {
    await this.supabaseService.signOut();
    window.location.reload();
  }

  // ----------------- Register -----------------

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      height: 'auto',
      width: '80%',
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // ----------------- User Info -----------------

  newName='';
  public updateUserName(newName: string) {
    if(newName != '') {
      this.supabaseService.updateProfileName(this.userEmail, newName);
      window.location.reload();
    }
  }

  newPhone='';
  updateUserPhone(newPhone: string) {
    if(newPhone.length == 10) {
      this.supabaseService.updateProfilePhone(this.userEmail, newPhone);
      window.location.reload();
    }
  }

  newEmail='';
  updateUserEmail(newEmail: string) {
    if(newEmail != '') {
      this.supabaseService.updateProfileEmail(newEmail);
      window.location.reload();
    }
  }

  newPassword='';
  updateUserPassword(newPassword: string) {
    if(newPassword != '') {
      this.supabaseService.updateProfilePassword(newPassword);
      window.location.reload();
    }
  }

  requestBusiness() {
    this.supabaseService.makeBusinessRequest(this.userEmail);
  }

  cancelRequest() {
    this.supabaseService.cancelBusinessRequest(this.userEmail);
  }
}
