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
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

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

  // check if user is logged in
  async isLoggedIn() {
    const {data, error} = await this.supabase.auth.getUser();
    if (!error) {
      return true;
    }
    else {
      return false;
    }
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  // ------------------ Login/Register ------------------

  signIn(email: string, password: string): Promise<any> {
    this._isLoggedIn.next(true);
    this._userEmail.next(email);
    return this.supabase.auth.signInWithPassword({ email, password })
  }
  
  signUp(email: string, password: string): Promise<any> {
    return this.supabase.auth.signUp({ email, password });
  }

  async resetPassword(email: string) {
    const {error} = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://cgca-site.vercel.app/account',
    })
    if (error) {
      return false;
    }
    else {
      return true;
    }
  }

  // ------------------ Profile ------------------

  async getAllProfiles() {
    const { data, error } = await this.supabase.from('profile').select('*');
    return { data, error };
  }

  async fetchUserId(): Promise<string | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user ? user!.id : null;
  }  

  async getProfile(uuid: string) {
    const { data, error } = await this.supabase
      .from('profile')
      .select('*')
      .eq('id', uuid)
      .single();
    return { data, error };
  }

  async updateProfileName(uuid: string, name:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .update({ name: name })
      .eq('id', uuid);
  }

  async updateProfilePhone(uuid: string, phone:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .update({ phone_number: phone })
      .eq('id', uuid);
  }

  async updateProfileEmail(new_email:string) {
    const { data, error } = await this.supabase.auth.updateUser({email: new_email});
  }

  async updateProfilePassword(new_password:string) {
    const { error } = await this.supabase.auth.updateUser({password: new_password});
    if (error) {
      return false;
    }
    else {
      return true;
    }
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

  async cancelForHireRequest(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .update({ for_hire_request: false })
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

  async getUserJobs(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('job_board')
      .select('*')
      .eq('email', currentEmail);
    return { data, error };
  }

  userJobs: JobBoardListing[] = [];
  async addJob(jobListing: JobBoardListing, userEmail: string) {
    const result = await this.getUserJobs(userEmail);
    if (result.error) {
      console.error('Error fetching events:', result.error);
      return { data: undefined, error: result.error };
    } 
    else {
      this.userJobs = result.data!;
      if(this.userJobs.length > 0) {
        const { data, error } = await this.supabase
          .from('job_board')
          .update([jobListing])
          .eq('email', userEmail);

        return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
        error };
      }
      else {
        const { data, error } = await this.supabase
        .from('job_board')
        .insert([jobListing]);

        return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
        error };
      }
    }
  }

  async deleteJobBoardListing(userEmail: string) {
    const { error } = await this.supabase
      .from('job_board')
      .delete()
      .eq('email', userEmail);

    if (error) {
      return false;
    }
    else {
      return true;
    }
  }

  // ------------------ For Hire ------------------

  async getAllHires() {
    const { data, error } = await this.supabase.from('for_hire').select('*');
    return { data, error };
  }

  async getUserHires(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('for_hire')
      .select('*')
      .eq('email', currentEmail);
    return { data, error };
  }

  userHires: ForHireListing[] = [];
  async addForHire(forHireEntry: ForHireListing, userEmail: string) {
    const result = await this.getUserHires(userEmail);
    if (result.error) {
      console.error('Error fetching events:', result.error);
      return { data: undefined, error: result.error };
    } 
    else {
      this.userHires = result.data!;
      if(this.userHires.length > 0) {
        const { data, error } = await this.supabase
          .from('for_hire')
          .update([forHireEntry])
          .eq('email', userEmail);

        return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
        error };
      }
      else {
        this.makeForHireRequest(userEmail);
        const { data, error } = await this.supabase
        .from('for_hire')
        .insert([forHireEntry]);

        return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
        error };
      }
    }
  }

  async deleteForHireListing(userEmail: string) {
    const { error } = await this.supabase
      .from('for_hire')
      .delete()
      .eq('email', userEmail);

    if (error) {
      return false;
    }
    else {
      await this.cancelForHireRequest(userEmail);
      return true;
    }
  }

  // ------------------ Business ------------------

  async getAllBusinesses() {
    const { data, error } = await this.supabase.from('business').select('*');
    return { data, error };
  }

  async getUserBusiness(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('business')
      .select('*')
      .eq('email', currentEmail);
    return { data, error };
  }

  userBusiness: BusinessListing[] = [];
  async addBusiness(listing: BusinessListing, userEmail: string) {
    const result = await this.getUserBusiness(userEmail);
    if (result.error) {
      console.error('Error fetching events:', result.error);
      return { data: undefined, error: result.error };
    } 
    else {
      this.userBusiness = result.data!;
      if(this.userBusiness.length > 0) {
        const { data, error } = await this.supabase
          .from('business')
          .update([listing])
          .eq('email', userEmail);

        return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
        error };
      }
      else {
        const { data, error } = await this.supabase
        .from('business')
        .insert([listing]);

        return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
        error };
      }
    }
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

  async deleteBusiness(userEmail: string) {
    const { error } = await this.supabase
      .from('business')
      .delete()
      .eq('email', userEmail);

    if (error) {
      return false;
    }
    else {
      return true;
    }
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
}