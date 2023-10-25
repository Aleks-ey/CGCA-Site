import { Component, OnInit, Input } from '@angular/core';
import { SupabaseService, Profile } from 'src/app/supabase.service';
import { FormBuilder } from '@angular/forms';
import { AuthSession, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-community',
  templateUrl: `community.component.html`,
  styleUrls: ['./community.component.css'],
})
export class CommunityComponent {
  profile: Profile | null = null;

  constructor(private supabaseService: SupabaseService, private auth: SupabaseService) {
  }

  ngOnInit() {

    // console.log(this.supabaseService.fetchUser().then((res) => {console.log(res)}));
    // console.log(this.supabaseService.profile(this.supabaseService.fetchProfile()));
  }
}

