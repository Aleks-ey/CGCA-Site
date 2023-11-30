import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SupabaseService } from 'src/app/supabase.service';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css']
})
export class UpdateAccountComponent {
  constructor(
    private supabaseService: SupabaseService, 
    private formBuilder: FormBuilder,
    private auth: SupabaseService,
    public dialog: MatDialog,
  ) { }

  @ViewChild('dialogTemplateSuccess') dialogTemplateSuccess!: TemplateRef<any>;
  @ViewChild('dialogTemplateFail') dialogTemplateFail!: TemplateRef<any>;

  public form: FormGroup = new FormGroup({
    name: this.formBuilder.control(''),
    email: this.formBuilder.control(''),
    phone_number: this.formBuilder.control(''),
    password: this.formBuilder.control(''),
  });

  userEmail: any;
  userName: any;
  userPhone: any;

  async ngOnInit() {
    // Initialize user profile data.
    let profileData: any;
    const userId = await this.supabaseService.fetchUserId();
    if (userId) {
      profileData = await this.supabaseService.getProfile(userId);
      this.userEmail = profileData.data?.email;
      this.userName = profileData.data?.name;
      this.userPhone = profileData.data?.phone_number;
    }
    this.form.patchValue({
      name: this.userName,
      email: this.userEmail,
      phone_number: this.userPhone,
    });
  }

  async onSubmit() {
    const userId = await this.supabaseService.fetchUserId();

    if (!userId) {
      this.dialog.open(this.dialogTemplateFail);
      return;
    }

    const formValue = this.form.value;

    try {
      // Update name
      if (formValue.name !== this.userName) {
        await this.supabaseService.updateProfileName(userId, formValue.name);
      }

      // Update phone number
      if (formValue.phone_number !== this.userPhone) {
        await this.supabaseService.updateProfilePhone(userId, formValue.phone_number);
      }

      // Update email
      if (formValue.email !== this.userEmail) {
        await this.supabaseService.updateProfileEmail(formValue.email);
      }

      // Update password
      if (formValue.password) {
        const passwordUpdateResult = await this.supabaseService.updateProfilePassword(formValue.password);
        if (!passwordUpdateResult) {
          throw new Error('Password update failed');
        }
      }

      // If everything is successful, show success dialog
      this.dialog.open(this.dialogTemplateSuccess);
    } catch (error) {
      console.error('Update failed:', error);
      this.dialog.open(this.dialogTemplateFail);
    }
  }
}
