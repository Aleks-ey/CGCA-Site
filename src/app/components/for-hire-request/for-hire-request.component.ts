import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, NgModel, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

export interface ForHireListing {
  id?: number;
  profile_id: string;
  name: string;
  profession: string;
  about: string;
  email: string;
  phone_number: string;
  location: string;
  work_outside: boolean;
  approved: boolean;
}

@Component({
  selector: 'app-for-hire-request',
  templateUrl: './for-hire-request.component.html',
  styleUrls: ['./for-hire-request.component.css'],
})
export class ForHireRequestComponent {
  constructor(
    private supabaseService: SupabaseService, 
    private formBuilder: FormBuilder,
    private auth: SupabaseService,
    public dialog: MatDialog,
  ) { }

  userEmail: any;
  userName: any;
  userPhone: any;
  userHireListing: ForHireListing[] = [];

  @ViewChild('dialogTemplateSuccess') dialogTemplateSuccess!: TemplateRef<any>;
  @ViewChild('dialogTemplateFail') dialogTemplateFail!: TemplateRef<any>;

  public form: FormGroup = new FormGroup({
    name: new FormControl(''),
    profession: new FormControl(''),
    about: new FormControl(''),
    email: new FormControl(''),
    phone_number: new FormControl(''),
    location: new FormControl(''),
    work_outside: new FormControl(''),
    approved: new FormControl(''),
  });

  async ngOnInit() {
    // Initialize user profile data.
    let profileData: any;
    const userId = await this.supabaseService.fetchUserId();
    if (userId) {
      profileData = await this.supabaseService.getProfile(userId);
      this.userEmail = profileData.data?.email;
      this.userName = profileData.data?.name;
      this.userPhone = profileData.data?.phone_number;
  
      const userHires = await this.supabaseService.getUserHires(userId);
      if (userHires.error) {
        console.error('Error fetching data:', userHires.error);
      } 
      else {
        this.userHireListing = userHires.data!;
        if (this.userHireListing.length > 0) {
          this.form.patchValue({
            name: this.userHireListing[0].name,
            profession: this.userHireListing[0].profession,
            about: this.userHireListing[0].about,
            email: this.userHireListing[0].email,
            phone_number: this.userHireListing[0].phone_number,
            location: this.userHireListing[0].location,
            work_outside: this.userHireListing[0].work_outside,
            approved: false,
          });
        }
        else {
          this.form.patchValue({
            name: this.userName,
            profession: '',
            about: '',
            email: this.userEmail,
            phone_number: this.userPhone,
            location: '',
            work_outside: false,
            approved: false,
          });
        }
      }
    }
    else {
      console.error('User ID is null.');
    }
  }

  async onSubmit() {
    const userId = await this.supabaseService.fetchUserId();
    if (userId) {
      const addHireData = await this.supabaseService.addForHire(this.form.value, userId);
      if (addHireData.error) {
        console.error('Error inserting data:', addHireData.error);
        const dialogRef = this.dialog.open(this.dialogTemplateFail);
      } else {
        console.log('Request submitted successfully!');
        const dialogRef = this.dialog.open(this.dialogTemplateSuccess);
        setTimeout(() => { window.location.reload(), 3000 });
      }
    }
    else {
      console.error('User ID is null.');
    }
  }
}
