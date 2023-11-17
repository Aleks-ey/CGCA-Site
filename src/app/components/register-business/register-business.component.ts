import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  constructor(
    private supabaseService: SupabaseService, 
    private formBuilder: FormBuilder,
    private storage: SupabaseService,
    public dialog: MatDialog,
  ) { }

  @ViewChild('dialogTemplateSuccess') dialogTemplateSuccess!: TemplateRef<any>;
  @ViewChild('dialogTemplateFail') dialogTemplateFail!: TemplateRef<any>;

  public form: FormGroup = new FormGroup({
    company_name: this.formBuilder.control(''),
    type: this.formBuilder.control(''),
    description: this.formBuilder.control(''),
    owner: this.formBuilder.control(''),
    email: this.formBuilder.control(''),
    phone_number: this.formBuilder.control(''),
    location: this.formBuilder.control(''),
    image_url: this.formBuilder.control(''),
  });

  userEmail: any;
  userName: any;
  userPhone: any;
  userBusiness: BusinessListing[] = [];

  temp_image_url: any;
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
          this.selectedFile = input.files[0];
      }
  }

  async ngOnInit() {
    this.userEmail = await this.supabaseService.fetchUserEmail();
    this.userName = this.supabaseService.fetchUserName(this.userEmail);
      this.userPhone = this.supabaseService.fetchUserPhone(this.userEmail);
    // await this.supabaseService.profile(this.userEmail)?.then(
    //   (res) => { 
    //     this.userName = res.data?.name 
    //     this.userPhone = res.data?.phone_number}
    // );

    const result = await this.supabaseService.getUserBusiness(this.userEmail);
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } 
    else {
      this.userBusiness = result.data!;
      if(this.userBusiness.length > 0) {
        this.form.patchValue({
          company_name: this.userBusiness[0].company_name,
          type: this.userBusiness[0].type,
          description: this.userBusiness[0].description,
          owner: this.userBusiness[0].owner,
          email: this.userBusiness[0].email,
          phone_number: this.userBusiness[0].phone_number,
          location: this.userBusiness[0].location,
          image_url: this.userBusiness[0].image_url,
        });
      }
      else {
        this.form.patchValue({
          owner: this.userName,
          email: this.userEmail,
          phone_number: this.userPhone,
        });
      }
    }
  }

  async onSubmit() {
    // this.temp_image_url = await this.storage.addBusinessImage(this.selectedFile);
    // console.log(this.temp_image_url);

    const result = await this.supabaseService.addBusiness(this.form.value, this.userEmail);
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
