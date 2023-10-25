import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
}

@Component({
  selector: 'app-for-hire-request',
  templateUrl: './for-hire-request.component.html',
  styleUrls: ['./for-hire-request.component.css'],
})
export class ForHireRequestComponent {
  forHireEntry: ForHireListing = {
    name: '',
    profession: '',
    about: '',
    email: '',
    phone_number: '',
    location: '',
    work_outside: false,
  };

  constructor(
    private supabaseService: SupabaseService, 
    private formBuilder: FormBuilder
    ) { }

  async onSubmit() {
    const result = await this.supabaseService.addForHire(this.forHireEntry);
    if (result.error) {
      console.error('Error inserting data:', result.error);
    } else {
      console.log('Request submitted successfully!');

      // await this.fetchForHire();

      this.forHireEntry = {
        name: '',
        profession: '',
        about: '',
        email: '',
        phone_number: '',
        location: '',
        work_outside: false,
      };
    }
  }
}
