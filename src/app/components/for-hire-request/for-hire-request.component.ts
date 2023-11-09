import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, NgModel, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

export interface ForHireListing {
  id?: number;
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
    this.userEmail = await this.supabaseService.fetchUserEmail();
    await this.supabaseService.profile(this.userEmail)?.then(
      (res) => { 
        this.userName = res.data?.name 
        this.userPhone = res.data?.phone_number}
    );

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

  async onSubmit() {
    const result = await this.supabaseService.addForHire(this.form.value);
    if (result.error) {
      console.error('Error inserting data:', result.error);
      const dialogRef = this.dialog.open(this.dialogTemplateFail);
    } else {
      console.log('Request submitted successfully!');

      this.supabaseService.makeForHireRequest(this.userEmail);

      const dialogRef = this.dialog.open(this.dialogTemplateSuccess);
      setTimeout(() => { window.location.reload(), 3000 });
    }
  }
}
