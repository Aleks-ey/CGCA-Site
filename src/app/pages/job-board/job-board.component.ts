import { Component } from '@angular/core';
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
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.css'],
})
export class JobBoardComponent {

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

  jobsList: JobBoardListing[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const result = await this.supabaseService.getAllJobs();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.jobsList = result.data!;
    }
  }
}
