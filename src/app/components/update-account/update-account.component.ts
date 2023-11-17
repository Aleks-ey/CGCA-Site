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
    this.userEmail = await this.supabaseService.fetchUserEmail();
    this.userName = this.supabaseService.fetchUserName(this.userEmail);
      this.userPhone = this.supabaseService.fetchUserPhone(this.userEmail);
    // await this.supabaseService.profile(this.userEmail)?.then(
    //   (res) => { 
    //     this.userName = res.data?.name 
    //     this.userPhone = res.data?.phone_number}
    // );

    this.form.patchValue({
      name: this.userName,
      email: this.userEmail,
      phone_number: this.userPhone,
    });
  }

  async onSubmit() {
    
  }
}
