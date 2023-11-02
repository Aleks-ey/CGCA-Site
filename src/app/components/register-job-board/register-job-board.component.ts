import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SupabaseService } from 'src/app/supabase.service';

export interface JobBoardListing {
  id?: number;
  company_name: string;
  job_title: string;
  job_description: string;
  email: string;
  phone_number: string;
  pay: string;
  location: string;
  approved: boolean;
}

@Component({
  selector: 'app-register-job-board',
  templateUrl: './register-job-board.component.html',
  styleUrls: ['./register-job-board.component.css'],
})
export class RegisterJobBoardComponent {
  listing: JobBoardListing = {
    company_name: '',
    job_title: '',
    job_description: '',
    email: '',
    phone_number: '',
    pay: '',
    location: '',
    approved: false,
  };

  constructor(
    private supabaseService: SupabaseService, 
    private formBuilder: FormBuilder,
    private auth: SupabaseService,
  ) { }

  userEmail: any;

  async onSubmit() {
    const result = await this.supabaseService.addJob(this.listing);
    if (result.error) {
      console.error('Error inserting data:', result.error);
    } else {
      console.log('Request submitted successfully!');

      this.userEmail = await this.supabaseService.fetchUserEmail();

      this.listing = {
        company_name: '',
        job_title: '',
        job_description: '',
        email: '',
        phone_number: '',
        pay: '',
        location: '',
        approved: false,
      };
    }
  }
}
