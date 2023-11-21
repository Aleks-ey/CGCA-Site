import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;

  @ViewChild('dialogRegisterSuccess') dialogRegisterSuccess!: TemplateRef<any>;
  @ViewChild('dialogRegisterFail') dialogRegisterFail!: TemplateRef<any>;

  constructor(
      private supabaseService: SupabaseService, 
      private formBuilder: FormBuilder, 
      private auth: SupabaseService,
      private router: Router,
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<RegisterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.registerForm = this.formBuilder.group({
      name: formBuilder.control('', [Validators.required, Validators.minLength(2)]),
      phone_number: formBuilder.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
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

  public registerSubmit() {
    this.auth
      .signUp(this.registerForm.value.email, this.registerForm.value.password)
      .then(async (res) => {
        if (res.data.user.role === 'authenticated') {
          const dialogRef = this.dialog.open(this.dialogRegisterSuccess);
          let profileData: any;
          const userId = await this.supabaseService.fetchUserId();
          if (userId) {
            // If userId is not null, update name and phone number.
            await this.supabaseService.updateProfileName(userId, this.registerForm.value.name);
            await this.supabaseService.updateProfilePhone(userId, this.registerForm.value.phone_number);
          } else {
            // Handle the case when there is no user logged in.
            console.error('No user is logged in.');
          }
            
          setTimeout(() => {
            this.auth.signIn(this.registerForm.value.email, this.registerForm.value.password);
          }, 2000);
          setTimeout(() => {
            this.dialogRef.close();
            this.router.navigate(['/account']);
          }, 4000);
        }
      })
      .catch((err) => {
        const dialogRef = this.dialog.open(this.dialogRegisterFail);
        console.log(err);
      });
  }
}
