import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  router: any;

  @ViewChild('dialogTemplate1') dialogTemplate1!: TemplateRef<any>;
  @ViewChild('dialogTemplate2') dialogTemplate2!: TemplateRef<any>;

  constructor(
      private supabaseService: SupabaseService, 
      private formBuilder: FormBuilder, 
      private auth: SupabaseService,
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<RegisterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.registerForm = this.formBuilder.group({
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

  public onSubmit() {
    console.log(this.registerForm.value);
    this.auth
      .signUp(this.registerForm.value.email, this.registerForm.value.password)
      .then((res) => {
        console.log(res.data.user.role);
        if (res.data.user.role === 'authenticated') {
          const dialogRef = this.dialog.open(this.dialogTemplate1);
          // set timeout
          setTimeout(() => {
            dialogRef.close();
          }, 4000);
        }
      })
      .catch((err) => {
        const dialogRef = this.dialog.open(this.dialogTemplate2);
        console.log(err);
      });
  }
}
