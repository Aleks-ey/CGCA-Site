import { Component, OnInit, Input } from "@angular/core";
import { SupabaseService } from "src/app/supabase.service";
import { FormBuilder } from "@angular/forms";
import { AuthSession, SupabaseClient } from "@supabase/supabase-js";
import { Router } from "@angular/router";

@Component({
  selector: "app-community",
  templateUrl: `community.component.html`,
})
export class CommunityComponent {
  constructor(
    private supabaseService: SupabaseService,
    private auth: SupabaseService,
    private router: Router
  ) {}

  // ------------------ MyAccount Navigation ------------------
  async navigateToAccount() {
    await this.supabaseService.isLoggedIn().then((res) => {
      if (res === true) {
        this.router.navigate(["/account"]);
      } else {
        this.router.navigate(["/account-login"]);
      }
    });
  }
}
