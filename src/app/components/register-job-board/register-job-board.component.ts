import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SupabaseService } from 'src/app/supabase.service';
import { BusinessListing } from '../register-business/register-business.component';

export interface JobBoardListing {
  id?: number;
  profile_id: string;
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
  constructor(
    private supabaseService: SupabaseService, 
    private formBuilder: FormBuilder,
    private auth: SupabaseService,
    public dialog: MatDialog,
  ) { }

  @ViewChild('dialogTemplateSuccess') dialogTemplateSuccess!: TemplateRef<any>;
  @ViewChild('dialogTemplateFail') dialogTemplateFail!: TemplateRef<any>;

  public form: FormGroup = new FormGroup({
    company_name: this.formBuilder.control(''),
    job_title: this.formBuilder.control(''),
    job_description: this.formBuilder.control(''),
    email: this.formBuilder.control(''),
    phone_number: this.formBuilder.control(''),
    pay: this.formBuilder.control(''),
    location: this.formBuilder.control(''),
  });

  userEmail: any;
  userName: any;
  userPhone: any;
  userJobBoardListing: JobBoardListing[] = [];
  userBusiness: BusinessListing[] = [];

  async ngOnInit() {
    // Initialize user profile data.
    let profileData: any;
    const userId = await this.supabaseService.fetchUserId();
    if (userId) {
      profileData = await this.supabaseService.getProfile(userId);
      this.userEmail = profileData.data?.email;
      this.userName = profileData.data?.name;
      this.userPhone = profileData.data?.phone_number;

      const userJobs = await this.supabaseService.getUserJobs(userId);
      const userBusiness = await this.supabaseService.getUserBusiness(userId);
      this.userJobBoardListing = userJobs.data!;
      this.userBusiness = userBusiness.data!;
      if (this.userJobBoardListing.length > 0) {
        this.form.patchValue({
          company_name: this.userJobBoardListing[0].company_name,
          job_title: this.userJobBoardListing[0].job_title,
          job_description: this.userJobBoardListing[0].job_description,
          email: this.userJobBoardListing[0].email,
          phone_number: this.userJobBoardListing[0].phone_number,
          pay: this.userJobBoardListing[0].pay,
          location: this.userJobBoardListing[0].location,
        });
      }
      else if(this.userBusiness.length > 0){
        this.form.patchValue({
          company_name: this.userBusiness[0].company_name,
          email: this.userBusiness[0].email,
          phone_number: this.userBusiness[0].phone_number,
          location: this.userBusiness[0].location,
        });
      }
      else {
        this.form.patchValue({
          email: this.userEmail,
          phone_number: this.userPhone,
        });
      }
    }
    else {
      console.error('User ID is null.');
    }
  }

  async onSubmit() {
    const userId = await this.supabaseService.fetchUserId();
    if (userId) {
      const result = await this.supabaseService.addJobBoard(this.form.value, userId);
      if (result.error) {
        console.error('Error inserting data:', result.error);
        const dialogRef = this.dialog.open(this.dialogTemplateFail);
      } else {
        console.log('Request submitted successfully!');

        const dialogRef = this.dialog.open(this.dialogTemplateSuccess);
        setTimeout(() => { window.location.reload(), 3000});
      }
    } else {
      console.error('User ID is null.');
    }
  }
}
