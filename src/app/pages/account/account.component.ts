import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForHireListing, ForHireRequestComponent } from 'src/app/components/for-hire-request/for-hire-request.component';
import { BusinessListing, RegisterBusinessComponent } from 'src/app/components/register-business/register-business.component';
import { JobBoardListing, RegisterJobBoardComponent } from 'src/app/components/register-job-board/register-job-board.component';

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
      this.hasBusinessRequest = await this.supabaseService.checkBusinessRequest(this.userEmail);
      this.hasForHireRequest = await this.supabaseService.checkForHireRequest(this.userEmail);

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

  @ViewChild('dialogLoginFail') dialogLoginFail!: TemplateRef<any>;
  async onLoginSubmit() {
    this.auth
      .signIn(this.loginForm.value.email, this.loginForm.value.password)
      .then((res) => {
        if (res.data.user.role === 'authenticated') {
          setTimeout(() => {window.location.reload(), 2000});
        }
      })
      .catch((err) => {
        const dialogRef = this.dialog.open(this.dialogLoginFail);
      });
  }

  async logout() {
    await this.supabaseService.signOut();
    window.location.reload();
  }

  @ViewChild('dialogResetPassword') dialogResetPassword!: TemplateRef<any>;
  openPasswordResetDialog(): void {
    const dialogRef = this.dialog.open(this.dialogResetPassword, {
      // height: 'auto',
      // width: '80%',
    });
  }

  password_reset_email='';
  password_reset_check = false;
  @ViewChild('dialogPasswordResetSuccess') dialogPasswordResetSuccess!: TemplateRef<any>;
  @ViewChild('dialogPasswordResetFail') dialogPasswordResetFail!: TemplateRef<any>;
  async resetPassword(password_reset_email: string) {
    this.password_reset_check = await this.supabaseService.resetPassword(password_reset_email);

    if(this.password_reset_check) {
      const dialogRef = this.dialog.open(this.dialogPasswordResetSuccess);
      setTimeout(() => {this.dialog.closeAll(), 3000});
    }
    else {
      const dialogRef = this.dialog.open(this.dialogPasswordResetFail);
    }
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
  async updateUserName(newName: string) {
    if(newName != '') {
      this.supabaseService.updateProfileName(this.userEmail, newName);
      setTimeout(() => {window.location.reload(), 3000});
    }
  }

  newPhone='';
  async updateUserPhone(newPhone: string) {
    console.log(newPhone);
    if(newPhone.length == 10) {
      this.supabaseService.updateProfilePhone(this.userEmail, newPhone);
      setTimeout(() => {window.location.reload(), 3000});
    }
  }

  newEmail='';
  async updateUserEmail(newEmail: string) {
    if(newEmail != '') {
      this.supabaseService.updateProfileEmail(newEmail);
      setTimeout(() => {window.location.reload(), 3000});
    }
  }

  @ViewChild('dialogPasswordUpdateSuccess') dialogPasswordUpdateSuccess!: TemplateRef<any>;
  @ViewChild('dialogPasswordUpdateFail') dialogPasswordUpdateFail!: TemplateRef<any>;
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

  @ViewChild ('dialogRegisterBusiness') dialogRegisterBusiness!: TemplateRef<any>;
  async requestBusiness() {
    this.supabaseService.makeBusinessRequest(this.userEmail);
    const dialogRef = this.dialog.open(this.dialogRegisterBusiness);
    setTimeout(() => {window.location.reload(), 3000});
  }

  @ViewChild ('dialogRescindBusiness') dialogRescindBusiness!: TemplateRef<any>;
  async cancelRequest() {
    this.supabaseService.cancelBusinessRequest(this.userEmail);
    const dialogRef = this.dialog.open(this.dialogRescindBusiness);
    setTimeout(() => {window.location.reload(), 3000});
  }

  // ----------------- Edits -----------------

  openEditHireDialog(): void {
    const dialogRef = this.dialog.open(ForHireRequestComponent, {
      // height: 'auto',
      // width: '80%',
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEditBusinessDialog(): void {
    const dialogRef = this.dialog.open(RegisterBusinessComponent, {
      // height: 'auto',
      // width: '80%',
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
    const check = await this.supabaseService.deleteForHireListing(this.userEmail);
    if(check) {
      const dialogRef = this.dialog.open(this.dialogDeleteForHireSuccess);
      setTimeout(() => {window.location.reload(), 3000});
    }
    else {
      const dialogRef = this.dialog.open(this.dialogDeleteForHireFail);
    }
  }

  @ViewChild('dialogDeleteBusiness') dialogDeleteBusiness!: TemplateRef<any>;
  openDeleteBusinessDialog(): void {
    const dialogRef = this.dialog.open(this.dialogDeleteBusiness);
  }

  @ViewChild('dialogDeleteBusinessSuccess') dialogDeleteBusinessSuccess!: TemplateRef<any>;
  @ViewChild('dialogDeleteBusinessFail') dialogDeleteBusinessFail!: TemplateRef<any>;
  async deleteBusiness() {
    const check = await this.supabaseService.deleteBusiness(this.userEmail);
    if(check) {
      const dialogRef = this.dialog.open(this.dialogDeleteBusinessSuccess);
      setTimeout(() => {window.location.reload(), 3000});
    }
    else {
      const dialogRef = this.dialog.open(this.dialogDeleteBusinessFail);
    }
  }

  @ViewChild('dialogDeleteJobBoard') dialogDeleteJobBoard!: TemplateRef<any>;
  openDeleteJobBoardDialog(): void {
    const dialogRef = this.dialog.open(this.dialogDeleteJobBoard);
  }

  @ViewChild('dialogDeleteJobBoardSuccess') dialogDeleteJobBoardSuccess!: TemplateRef<any>;
  @ViewChild('dialogDeleteJobBoardFail') dialogDeleteJobBoardFail!: TemplateRef<any>;
  async deleteJobBoardListing() {
    const check = await this.supabaseService.deleteJobBoardListing(this.userEmail);
    if(check) {
      const dialogRef = this.dialog.open(this.dialogDeleteJobBoardSuccess);
      setTimeout(() => {window.location.reload(), 3000});
    }
    else {
      const dialogRef = this.dialog.open(this.dialogDeleteJobBoardFail);
    }
  }
}
