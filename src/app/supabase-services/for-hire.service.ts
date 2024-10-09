import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";
import { ForHireListing } from "src/app/models/forHireListing.model";

@Injectable({
  providedIn: "root",
})
export class ForHireService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getAllHires() {
    const { data, error } = await this.supabase.from("for_hire").select("*");
    return { data, error };
  }

  async getAllHireEdits() {
    const { data, error } = await this.supabase
      .from("for_hire_edits")
      .select("*");
    return { data, error };
  }

  async getUserHires(uuid: string) {
    const { data, error } = await this.supabase
      .from("for_hire")
      .select("*")
      .eq("profile_id", uuid);
    return { data, error };
  }

  async getUserHireEdits(uuid: string) {
    const { data, error } = await this.supabase
      .from("for_hire_edits")
      .select("*")
      .eq("profile_id", uuid);
    return { data, error };
  }

  async addForHire(forHireEntry: ForHireListing, uuid: string) {
    try {
      const result = await this.getUserHires(uuid);
      forHireEntry.profile_id = uuid;
      if (result.error) {
        console.error("Error fetching user hires:", result.error);
        return { data: undefined, error: result.error };
      }

      let response;
      if (result.data && result.data.length > 0) {
        // Check if user has an approved for hire listing
        if (result.data[0].approved) {
          response = await this.supabase
            .from("for_hire_edits")
            .insert([forHireEntry]);
        } else {
          // Update unapproved for hire listing
          response = await this.supabase
            .from("for_hire")
            .update([forHireEntry]);
        }
      } else {
        // Insert new for hire listing if none exist
        response = await this.supabase.from("for_hire").insert([forHireEntry]);
      }

      return {
        data: response.data ? response.data[0] : undefined,
        error: response.error,
      };
    } catch (error) {
      console.error("Error in addForHire:", error);
      return { data: undefined, error };
    }
  }

  async deleteForHireListing(uuid: string) {
    const { error } = await this.supabase
      .from("for_hire")
      .delete()
      .eq("profile_id", uuid);
    return !error;
  }

  async deleteForHireEditListing(uuid: string) {
    const { error } = await this.supabase
      .from("for_hire_edits")
      .delete()
      .eq("profile_id", uuid);
    return !error;
  }

  async replaceForHire(uuid: string) {
    const result = await this.supabase
      .from("for_hire_edits")
      .select("*")
      .eq("profile_id", uuid);
    if (result.error) {
      console.error("Error fetching events:", result.error);
      return { data: undefined, error: result.error };
    } else {
      const forHireEdit = result.data![0];
      const { data, error } = await this.supabase
        .from("for_hire")
        .update(forHireEdit)
        .eq("profile_id", uuid);
      if (error) throw error;
      await this.deleteForHireEditListing(uuid);
      return data;
    }
  }

  async updateHiresApproved(uuid: string, toggleValue: boolean) {
    const { data, error } = await this.supabase
      .from("for_hire")
      .update({ approved: toggleValue })
      .eq("profile_id", uuid);
    if (error) throw error;
    return data;
  }

  async updateHiresEditApproved(uuid: string, toggleValue: boolean) {
    const { data, error } = await this.supabase
      .from("for_hire_edits")
      .update({ approved: toggleValue })
      .eq("profile_id", uuid);
    if (error) throw error;
    return data;
  }
}
