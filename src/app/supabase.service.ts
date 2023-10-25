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
import { BusinessListing } from './pages/business/business.component';

export interface Profile {
  id?: string;
  email: string;
  business_acc: boolean;
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
      .update({ approved: toggleValue }) // Adjust column name accordingly
      .eq('email', currentEmail); // Add appropriate filtering

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

  // profile(user: User) {
  //   return this.supabase
  //     .from('profile')
  //     .select(`full_name, email, phone_number`)
  //     .eq('id', user.id)
  //     .single()
  // }

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

  // updateProfile(profile: Profile) {
  //   const update = {
  //     ...profile,
  //     updated_at: new Date(),
  //   }

  //   return this.supabase.from('profile').upsert(update)
  // }

  async fetchUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    // let metadata = user!.user_metadata
    return user?.email
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

  async getUserData(currentEmail:string) {
    const { data, error } = await this.supabase
      .from('profile')
      .select('*')
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

}