import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { CalendarEvent } from './pages/admin/calendarEvent.model';

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
      .from('Events')
      .insert([event]);

    return { data: data ? data[0] : undefined,  // Assuming 'data' is an array, return the first element.
    error };
  }

  async getAllEvents() {
    const { data, error } = await this.supabase.from('Events').select('*');
    return { data, error };
  }

  async deleteEvent(eventId: number) {
    const { data, error } = await this.supabase
      .from('Events')
      .delete()
      .match({ id: eventId });

    return { data, error };
  }
  // ------------------   ------------------

  // ------------------ Events ------------------
}

// import { Injectable } from '@angular/core'
// import {
//   AuthChangeEvent,
//   AuthSession,
//   createClient,
//   Session,
//   SupabaseClient,
//   User,
// } from '@supabase/supabase-js'
// import { environment } from 'src/environments/environment'

// export interface Profile {
//   id?: string
//   username: string
//   website: string
//   avatar_url: string
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class SupabaseService {
//   private supabase: SupabaseClient
//   _session: AuthSession | null = null

//   constructor() {
//     this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
//   }

//   get session() {
//     this.supabase.auth.getSession().then(({ data }) => {
//       this._session = data.session
//     })
//     return this._session
//   }

//   profile(user: User) {
//     return this.supabase
//       .from('profiles')
//       .select(`username, website, avatar_url`)
//       .eq('id', user.id)
//       .single()
//   }

//   authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
//     return this.supabase.auth.onAuthStateChange(callback)
//   }

//   signIn(email: string) {
//     return this.supabase.auth.signInWithOtp({ email })
//   }

//   signOut() {
//     return this.supabase.auth.signOut()
//   }

//   updateProfile(profile: Profile) {
//     const update = {
//       ...profile,
//       updated_at: new Date(),
//     }

//     return this.supabase.from('profiles').upsert(update)
//   }

//   downLoadImage(path: string) {
//     return this.supabase.storage.from('avatars').download(path)
//   }

//   uploadAvatar(filePath: string, file: File) {
//     return this.supabase.storage.from('avatars').upload(filePath, file)
//   }
// }