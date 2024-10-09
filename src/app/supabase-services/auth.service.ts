import { Injectable } from "@angular/core";
import {
  createClient,
  SupabaseClient,
  AuthSession,
  AuthChangeEvent,
  Session,
} from "@supabase/supabase-js";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private supabase: SupabaseClient;
  private _session: AuthSession | null = null;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();
  private _userEmail = new BehaviorSubject<string>("");
  userEmail$ = this._userEmail.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async isLoggedIn() {
    const { data, error } = await this.supabase.auth.getUser();
    if (!error) {
      return true;
    } else {
      return false;
    }
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  signIn(email: string, password: string): Promise<any> {
    this._isLoggedIn.next(true);
    this._userEmail.next(email);
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signUp(email: string, password: string): Promise<any> {
    return this.supabase.auth.signUp({ email, password });
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://cgca-site.vercel.app/account",
    });
    if (error) {
      return false;
    } else {
      return true;
    }
  }
}
