import { Component } from '@angular/core';
import { LoginComponent } from 'src/app/components/login/login.component';
import { SupabaseService } from 'src/app/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  userEmail: any;
  isLoggedIn = false;
  isBusiness = false;

  loginForm!: FormGroup;

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
    this.userEmail = await this.supabaseService.fetchUser();

    if(this.userEmail != null) {
      this.isLoggedIn = true;
      this.isBusiness = await this.supabaseService.checkBusinessAcc(this.userEmail);
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
          console.log(this.supabaseService.fetchUser());
          window.location.reload();
          // this.router.navigate(['/dashboard']);
        }
      })
      .catch((err) => {
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
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // ----------------- User Info -----------------

  
}
