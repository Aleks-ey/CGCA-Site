import { Component, Inject } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  router: any;

  constructor(
      private supabaseService: SupabaseService, 
      private formBuilder: FormBuilder, 
      private auth: SupabaseService,
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
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
