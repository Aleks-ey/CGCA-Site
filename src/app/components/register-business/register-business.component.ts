import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/supabase.service';

export interface BusinessListing {
  id?: number;
  company_name: string;
  type: string;
  description: string;
  owner: string;
  email: string;
  phone_number: string;
  location: string;
  image_url: string;
}

@Component({
  selector: 'app-register-business',
  templateUrl: './register-business.component.html',
  styleUrls: ['./register-business.component.css'],
})
export class RegisterBusinessComponent {
  businessListing: BusinessListing = {
    company_name: '',
    type: '',
    description: '',
    owner: '',
    email: '',
    phone_number: '',
    location: '',
    image_url: '',
  };

  constructor(
    private supabaseService: SupabaseService, 
    private formBuilder: FormBuilder,
    private storage: SupabaseService,
  ) { }

  userEmail: any;
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
          this.selectedFile = input.files[0];
      }
  }

  async onSubmit() {

    this.businessListing.image_url = await this.storage.addBusinessImage(this.selectedFile);

    const result = await this.supabaseService.addBusiness(this.businessListing);
    if (result.error) {
      console.error('Error inserting data:', result.error);
    } else {
      console.log('Request submitted successfully!');

      this.userEmail = await this.supabaseService.fetchUserEmail();
      this.supabaseService.makeBusinessRequest(this.userEmail);

      this.businessListing = {
        company_name: '',
        type: '',
        description: '',
        owner: '',
        email: '',
        phone_number: '',
        location: '',
        image_url: '',
      };
    }
  }

}
