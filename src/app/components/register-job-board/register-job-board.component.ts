import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SupabaseService } from 'src/app/supabase.service';
import { BusinessListing } from '../register-business/register-business.component';

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
    this.userEmail = await this.supabaseService.fetchUserEmail();
    this.userName = this.supabaseService.fetchUserName(this.userEmail);
      this.userPhone = this.supabaseService.fetchUserPhone(this.userEmail);
    // await this.supabaseService.profile(this.userEmail)?.then(
    //   (res) => { 
    //     this.userName = res.data?.name 
    //     this.userPhone = res.data?.phone_number}
    // );

    const result = await this.supabaseService.getUserJobs(this.userEmail);
    const result2 = await this.supabaseService.getUserBusiness(this.userEmail);
    this.userJobBoardListing = result.data!;
    this.userBusiness = result2.data!;
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

  async onSubmit() {
    const result = await this.supabaseService.addJob(this.form.value, this.userEmail);
    if (result.error) {
      console.error('Error inserting data:', result.error);
      const dialogRef = this.dialog.open(this.dialogTemplateFail);
    } else {
      console.log('Request submitted successfully!');

      const dialogRef = this.dialog.open(this.dialogTemplateSuccess);
      setTimeout(() => { window.location.reload(), 3000});
    }
  }
}
