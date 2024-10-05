import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { RegisterComponent } from "src/app/components/register/register.component";
import { SupabaseService } from "src/app/supabase.service";

@Component({
  selector: "app-account-login",
  templateUrl: "./account-login.component.html",
})
export class AccountLoginComponent {
  loginForm!: FormGroup;

  constructor(
    private supabaseService: SupabaseService,
    public dialog: MatDialog,
    private auth: SupabaseService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: formBuilder.control("", [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: formBuilder.control("", [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {}

  // ----------------- Register -----------------
  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      height: "auto",
      width: "90%",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  // ----------------- Login -----------------
  @ViewChild("dialogLoginFail") dialogLoginFail!: TemplateRef<any>;
  async onLoginSubmit() {
    this.auth
      .signIn(this.loginForm.value.email, this.loginForm.value.password)
      .then((res) => {
        if (res.data.user.role === "authenticated") {
          setTimeout(() => {
            this.router.navigate(["/account"]), 2000;
          });
        }
      })
      .catch((err) => {
        const dialogRef = this.dialog.open(this.dialogLoginFail);
      });
  }

  // ----------------- Reset Password -----------------
  @ViewChild("dialogResetPassword") dialogResetPassword!: TemplateRef<any>;
  openPasswordResetDialog(): void {
    const dialogRef = this.dialog.open(this.dialogResetPassword, {
      // height: 'auto',
      // width: '80%',
    });
  }

  password_reset_email = "";
  password_reset_check = false;
  @ViewChild("dialogPasswordResetSuccess")
  dialogPasswordResetSuccess!: TemplateRef<any>;
  @ViewChild("dialogPasswordResetFail")
  dialogPasswordResetFail!: TemplateRef<any>;
  async resetPassword(password_reset_email: string) {
    this.password_reset_check = await this.supabaseService.resetPassword(
      password_reset_email
    );

    if (this.password_reset_check) {
      const dialogRef = this.dialog.open(this.dialogPasswordResetSuccess);
      setTimeout(() => {
        this.dialog.closeAll(), 3000;
      });
    } else {
      const dialogRef = this.dialog.open(this.dialogPasswordResetFail);
    }
  }
}
