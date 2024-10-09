import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getAllProfiles() {
    const { data, error } = await this.supabase.from("profile").select("*");
    return { data, error };
  }

  async fetchUserId(): Promise<string | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user ? data.user.id : null;
  }

  async getProfile(uuid: string) {
    const { data, error } = await this.supabase
      .from("profile")
      .select("*")
      .eq("id", uuid)
      .single();
    return { data, error };
  }

  async updateProfileName(uuid: string, name: string) {
    const { data, error } = await this.supabase
      .from("profile")
      .update({ name: name })
      .eq("id", uuid);
    return { data, error };
  }

  async updateProfilePhone(uuid: string, phone: string) {
    const { data, error } = await this.supabase
      .from("profile")
      .update({ phone_number: phone })
      .eq("id", uuid);
    return { data, error };
  }

  async updateProfileEmail(new_email: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      email: new_email,
    });
    return { data, error };
  }

  async updateProfilePassword(new_password: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: new_password,
    });
    return error ? false : true;
  }
}
