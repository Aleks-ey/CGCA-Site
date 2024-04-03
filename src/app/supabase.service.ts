import { Injectable } from '@angular/core';
import { AuthChangeEvent, AuthSession, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'
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
  // sign out user
  async signOut() {
      return this.supabase.auth.signOut();
  }
  // sign in user
  signIn(email: string, password: string): Promise<any> {
      this._isLoggedIn.next(true);
      this._userEmail.next(email);
      return this.supabase.auth.signInWithPassword({ email, password })
  }
  // sign up user
  signUp(email: string, password: string): Promise<any> {
      return this.supabase.auth.signUp({ email, password });
  }
  // reset password through email
  async resetPassword(email: string) {
      const {error} = await this.supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'https://cgca-site.vercel.app/account',
      })
      if (error) { return false; }
      else { return true; }
  }
  // --------------------------------- PROFILE ---------------------------------
      // get all profiles
      async getAllProfiles() {
          const { data, error } = await this.supabase.from('profile').select('*');
          return { data, error };
      }
      // fetch user id based on session
      async fetchUserId(): Promise<string | null> {
          const {
              data: { user },
          } = await this.supabase.auth.getUser();
          return user ? user!.id : null;
      }  
      // get user profile based on user id
      async getProfile(uuid: string) {
          const { data, error } = await this.supabase.from('profile').select('*').eq('id', uuid).single();
          return { data, error };
      }
      // change user profile name
      async updateProfileName(uuid: string, name:string) {
          const { data, error } = await this.supabase.from('profile').update({ name: name }).eq('id', uuid);
      }
      // change user profile phone number
      async updateProfilePhone(uuid: string, phone:string) {
          const { data, error } = await this.supabase.from('profile').update({ phone_number: phone }).eq('id', uuid);
      }
      // change user profile email
      async updateProfileEmail(new_email:string) {
          const { data, error } = await this.supabase.auth.updateUser({email: new_email});
      }
      // change user profile password
      async updateProfilePassword(new_password:string) {
          const { error } = await this.supabase.auth.updateUser({password: new_password});
          if (error) { return false; }
          else { return true; }
      }
      // --------------------------------- PROFILE REQUESTS ---------------------------------
      // make for hire request
      // async makeForHireRequest(uuid: string) {
      //     const { data, error } = await this.supabase.from('profile').update({ for_hire_request: true }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // cancel for hire request
      // async cancelForHireRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ for_hire_request: false }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // make for hire edit request
      // async makeForHireEditRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ for_hire_edit_request: true }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // cancel for hire edit request
      // async cancelForHireEditRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ for_hire_edit_request: false }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // make business request
      // async makeBusinessRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ business_request: true }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      //   }
      // // cancel business request
      // async cancelBusinessRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ business_request: false }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // make business edit request
      // async makeBusinessEditRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ business_edit_request: true }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // cancel business edit request
      // async cancelBusinessEditRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ business_edit_request: false }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // make job board request
      // async makeJobBoardRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ job_board_request: true }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // cancel job board request
      // async cancelJobBoardRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ job_board_request: false }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // make job board edit request
      // async makeJobBoardEditRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ job_board_edit_request: true }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // }
      // // cancel job board edit request
      // async cancelJobBoardEditRequest(uuid:string) {
      //     const { data, error } = await this.supabase.from('profile').update({ job_board_edit_request: false }).eq('id', uuid);
      //     if (error) { throw error; }
      //     return data;
      // } 
  // --------------------------------- FOR HIRE ---------------------------------
  // get all for hire listings
  async getAllHires() {
      const { data, error } = await this.supabase.from('for_hire').select('*');
      return { data, error };
  }
  // get all for hire edit listings
  async getAllHireEdits() {
      const { data, error } = await this.supabase.from('for_hire_edit').select('*');
      return { data, error };
  }
  // get user for hire listings
  async getUserHires(uuid: string) {
      const { data, error } = await this.supabase.from('for_hire').select('*').eq('profile_id', uuid);
      return { data, error };
  }
  // get user for hire edit listings
  async getUserHireEdits(uuid: string) {
      const { data, error } = await this.supabase.from('for_hire_edit').select('*').eq('profile_id', uuid);
      return { data, error };
  }
  // create for hire listing or for hire edit listing
  userHires: ForHireListing[] = [];
  async addForHire(forHireEntry: ForHireListing, uuid: string) {
      const result = await this.getUserHires(uuid);
      forHireEntry.profile_id = uuid;
      if (result.error) {
          console.error('Error fetching events:', result.error);
          return { data: undefined, error: result.error };
      } 
      else {
          this.userHires = result.data!;
          if(this.userHires.length > 0) {
              const { data, error } = await this.supabase.from('for_hire_edit').insert([forHireEntry]);
              return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
              error };
          }
          else {
              const { data, error } = await this.supabase.from('for_hire').insert([forHireEntry]);
              return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
              error };
          }
      }
  }
  // delete for hire listing
  async deleteForHireListing(uuid: string) {
      const { error } = await this.supabase.from('for_hire').delete().eq('profile_id', uuid);
      if (error) { return false; }
      else {
        return true;
      }
  }
  // delete for hire edit listing
  async deleteForHireEditListing(uuid: string) {
      const { error } = await this.supabase.from('for_hire_edit').delete().eq('profile_id', uuid);
      if (error) { return false; }
      else {
        return true;
      }
  }
  // --------------------------------- BUSINESS ---------------------------------
      // get all business listings
      async getAllBusiness() {
          const { data, error } = await this.supabase.from('business').select('*');
          return { data, error };
      }
      // get all business edit listings
      async getAllBusinessEdits() {
          const { data, error } = await this.supabase.from('business_edit').select('*');
          return { data, error };
      }
      // get user business listings
      async getUserBusiness(uuid: string) {
          const { data, error } = await this.supabase.from('business').select('*').eq('profile_id', uuid);
          return { data, error };
      }
      // get user business edit listings
      async getUserBusinessEdits(uuid: string) {
          const { data, error } = await this.supabase.from('business_edit').select('*').eq('profile_id', uuid);
          return { data, error };
      }
      // create business listing or business edit listing
      userBusiness: BusinessListing[] = [];
      async addBusiness(businessEntry: BusinessListing, uuid: string) {
          const result = await this.getUserBusiness(uuid);
          businessEntry.profile_id = uuid;
          if (result.error) {
              console.error('Error fetching events:', result.error);
              return { data: undefined, error: result.error };
          } 
          else {
              this.userBusiness = result.data!;
              if(this.userBusiness.length > 0) {
                  const { data, error } = await this.supabase.from('business_edit').insert([businessEntry]);
                  return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
                  error };
              }
              else {
                  const { data, error } = await this.supabase.from('business').insert([businessEntry]);
                  return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
                  error };
              }
          }
      }
      // delete business listing
      async deleteBusinessListing(uuid: string) {
          const { error } = await this.supabase.from('business').delete().eq('profile_id', uuid);
          if (error) { return false; }
          else {
            return true;
          }
      }
      // delete business edit listing
      async deleteBusinessEditListing(uuid: string) {
          const { error } = await this.supabase.from('business_edit').delete().eq('profile_id', uuid);
          if (error) { return false; }
          else {
            return true;
          }
      }
  // --------------------------------- JOB BOARD ---------------------------------
  // get all job board listings
  async getAllJobs() {
      const { data, error } = await this.supabase.from('job_board').select('*');
      return { data, error };
  }
  // get all job board edit listings
  async getAllJobEdits() {
      const { data, error } = await this.supabase.from('job_board_edit').select('*');
      return { data, error };
  }
  // get user job board listings
  async getUserJobs(uuid: string) {
      const { data, error } = await this.supabase.from('job_board').select('*').eq('profile_id', uuid);
      return { data, error };
  }
  // get user job board edit listings
  async getUserJobEdits(uuid: string) {
      const { data, error } = await this.supabase.from('job_board_edit').select('*').eq('profile_id', uuid);
      return { data, error };
  }
  // create job board listing or job board edit listing
  userJobBoardListing: JobBoardListing[] = [];
  async addJobBoard(jobBoardEntry: JobBoardListing, uuid: string) {
      const result = await this.getUserJobs(uuid);
      jobBoardEntry.profile_id = uuid;
      if (result.error) {
          console.error('Error fetching events:', result.error);
          return { data: undefined, error: result.error };
      } 
      else {
          this.userJobBoardListing = result.data!;
          if(this.userJobBoardListing.length > 0) {
              const { data, error } = await this.supabase.from('job_board_edit').insert([jobBoardEntry]);
              return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
              error };
          }
          else {
              const { data, error } = await this.supabase.from('job_board').insert([jobBoardEntry]);
              return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
              error };
          }
      }
  }
  // delete job board listing
  async deleteJobBoardListing(uuid: string) {
      const { error } = await this.supabase.from('job_board').delete().eq('profile_id', uuid);
      if (error) { return false; }
      else {
          return true;
      }
  }
  // delete job board edit listing
  async deleteJobBoardEditListing(uuid: string) {
      const { error } = await this.supabase.from('job_board_edit').delete().eq('profile_id', uuid);
      if (error) { return false; }
      else {
          return true;
      }
  }
  // --------------------------------- REPLACE EDITS ---------------------------------
  // replace for hire with for hire edit and delete for hire edit
  async replaceForHire(uuid: string) {
      const result = await this.supabase.from('for_hire_edit').select('*').eq('profile_id', uuid);
      if (result.error) { 
          console.error('Error fetching events:', result.error);
          return { data: undefined, error: result.error };
      }
      else {
          const forHireEdit = result.data![0];
          const { data, error } = await this.supabase.from('for_hire').update(forHireEdit).eq('profile_id', uuid);
          if (error) { throw error; }
          else {
              await this.deleteForHireEditListing(uuid);
              return data;
          }
      }
  }
  // replace business with business edit and delete business edit
  async replaceBusiness(uuid: string) {
      const result = await this.supabase.from('business_edit').select('*').eq('profile_id', uuid);
      if (result.error) { 
          console.error('Error fetching events:', result.error);
          return { data: undefined, error: result.error };
      }
      else {
          const businessEdit = result.data![0];
          const { data, error } = await this.supabase.from('business').update(businessEdit).eq('profile_id', uuid);
          if (error) { throw error; }
          else {
              await this.deleteBusinessEditListing(uuid);
              return data;
          }
      }
  }
  // replace job board with job board edit and delete job board edit
  async replaceJobBoard(uuid: string) {
      const result = await this.supabase.from('job_board_edit').select('*').eq('profile_id', uuid);
      if (result.error) { 
          console.error('Error fetching events:', result.error);
          return { data: undefined, error: result.error };
      }
      else {
          const jobBoardEdit = result.data![0];
          const { data, error } = await this.supabase.from('job_board').update(jobBoardEdit).eq('profile_id', uuid);
          if (error) { throw error; }
          else {
              await this.deleteJobBoardEditListing(uuid);
              return data;
          }
      }
  }
  // ------------------ Admin ------------------
    // add event to calendar
    async addEvent(event: CalendarEvent) {
      const { data, error } = await this.supabase
        .from('events')
        .insert([event]);

      return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
      error };
    }
    // get all events
    async getAllEvents() {
      const { data, error } = await this.supabase.from('events').select('*');
      return { data, error };
    }
    // delete event
    async deleteEvent(eventId: number) {
      const { data, error } = await this.supabase
        .from('events')
        .delete()
        .match({ id: eventId });

      return { data, error };
    }
    // update event
    async updateEvent(event: CalendarEvent) {
      const { data, error } = await this.supabase
        .from('events')
        .update(event)
        .match({ id: event.id });

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