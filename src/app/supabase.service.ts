import { Injectable } from '@angular/core';
import { 
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { BehaviorSubject } from 'rxjs';

import { CalendarEvent } from './pages/admin/calendarEvent.model';
import { ForHireListing } from './components/for-hire-request/for-hire-request.component';
import { BusinessListing } from './components/register-business/register-business.component';
import { JobBoardListing } from './components/register-job-board/register-job-board.component';

export interface Profile {
  id?: string;
  email: string;
  business_acc: boolean;
  business_request: boolean;
  name: string;
  phone_number: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient

  // supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey)

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  // ------------------ Admin ------------------
  async addEvent(event: CalendarEvent) {
    const { data, error } = await this.supabase
      .from('events')
      .insert([event]);

    return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
    error };
  }

  async getAllEvents() {
    const { data, error } = await this.supabase.from('events').select('*');
    return { data, error };
  }

  async deleteEvent(eventId: number) {
    const { data, error } = await this.supabase
      .from('events')
      .delete()
      .match({ id: eventId });

    return { data, error };
  }

  async updateHiresApprovedRow(currentEmail:string, toggleValue: boolean) {
    const { data, error } = await this.supabase
      .from('for_hire')
      .update({ approved: toggleValue })
      .eq('email', currentEmail);

    if (error) {
      throw error;
    }
    return data;
  }

  async updateBusinessApprovedRow(currentEmail:string, toggleValue: boolean) {
    const { data, error } = await this.supabase
      .from('profile')
      .update({ business_acc: toggleValue })
      .eq('email', currentEmail);

    if (error) {
      throw error;
    }
    return data;
  }

  // ------------------ Profile ------------------

  _session: AuthSession | null = null

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();
  
  private _userEmail = new BehaviorSubject<string>('');
  userEmail$ = this._userEmail.asObservable();

  signIn(email: string, password: string): Promise<any> {
    this._isLoggedIn.next(true);
    this._userEmail.next(email);
    return this.supabase.auth.signInWithPassword({ email, password })
  }
  
  signUp(email: string, password: string): Promise<any> {
    return this.supabase.auth.signUp({ email, password });
  }

  signOut() {
    // this._isLoggedIn.next(false);
    // this._userEmail.next('');
    return this.supabase.auth.signOut()
  }

  async getAllProfiles() {
    const { data, error } = await this.supabase.from('profile').select('*');
    return { data, error };
  }

  async fetchUserEmail() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    // let metadata = user!.user_metadata
    return user?.email
  }

  async profile(currentEmail:string) {
    return this.supabase
      .from('profile')
      .select(`name, phone_number`)
      .eq('email', currentEmail)
      .single()
  }

  async checkBusinessAcc(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .select('business_acc')
      .eq('email', currentEmail);

    if (error) {
      throw error;
    }
    return data![0].business_acc;
  }

  async checkBusinessRequest(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .select('business_request')
      .eq('email', currentEmail);

    if (error) {
      throw error;
    }
    return data![0].business_request;
  }

  async checkForHireRequest(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .select('for_hire_request')
      .eq('email', currentEmail);

    if (error) {
      throw error;
    }
    return data![0].for_hire_request;
  }

  async getUserHires(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('for_hire')
      .select('*')
      .filter('approved', 'eq', true)
      .eq('email', currentEmail);
    return { data, error };
  }

  async getUserBusiness(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('business')
      .select('*')
      .eq('email', currentEmail);
    return { data, error };
  }

  async getUserJobs(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('job_board')
      .select('*')
      .eq('email', currentEmail);
    return { data, error };
  }

  async updateProfileName(currentEmail:string, name:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .update({ name: name })
      .eq('email', currentEmail);
  }

  async updateProfilePhone(currentEmail:string, phone:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .update({ phone_number: phone })
      .eq('email', currentEmail);
  }

  async updateProfileEmail(new_email:string) {
    const { data, error } = await this.supabase.auth.updateUser({email: new_email});
  }

  async updateProfilePassword(new_password:string) {
    const { data, error } = await this.supabase.auth.updateUser({password: new_password});
  }

  async makeBusinessRequest(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .update({ business_request: true })
      .eq('email', currentEmail);

    if (error) {
      throw error;
    }
    return data;
  }

  async cancelBusinessRequest(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .update({ business_request: false })
      .eq('email', currentEmail);

    if (error) {
      throw error;
    }
    return data;
  }

  async makeForHireRequest(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .update({ for_hire_request: true })
      .eq('email', currentEmail);

    if (error) {
      throw error;
    }
    return data;
  }

  // ------------------ Job Board ------------------

  async getAllJobs() {
    const { data, error } = await this.supabase.from('job_board').select('*');
    return { data, error };
  }

  async addJob(jobListing: JobBoardListing) {
    const { data, error } = await this.supabase
      .from('job_board')
      .insert([jobListing]);

    return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
    error };
  }

  // ------------------ For Hire ------------------

  async getAllHires() {
    const { data, error } = await this.supabase.from('for_hire').select('*');
    return { data, error };
  }

  async addForHire(forHireEntry: ForHireListing) {
    const { data, error } = await this.supabase
      .from('for_hire')
      .insert([forHireEntry]);

    return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
    error };
  }

  // ------------------ Business ------------------

  async getAllBusinesses() {
    const { data, error } = await this.supabase.from('business').select('*');
    return { data, error };
  }

  async addBusiness(listing: BusinessListing) {
    const { data, error } = await this.supabase
      .from('business')
      .insert([listing]);

    return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
    error };
  }

  async addBusinessImage(selectedFile: any) {
    if (selectedFile) {
      const { data, error } = await this.supabase.storage
        .from('business-images')
        .upload(selectedFile.name, selectedFile);

      if (error) {
        console.error('Error uploading file:', error);
        return '';
      } else {
        // Save the URL or filename to your database if needed
        return data.path;
      }
    }
    else {
      return '';
    }
  }

}