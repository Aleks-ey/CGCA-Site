import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";
import { BusinessListing } from "src/app/models/businessListing.model";

@Injectable({
  providedIn: "root",
})
export class BusinessService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getAllBusiness() {
    const { data, error } = await this.supabase.from("business").select("*");
    return { data, error };
  }

  async getAllBusinessEdits() {
    const { data, error } = await this.supabase
      .from("business_edits")
      .select("*");
    return { data, error };
  }

  async getUserBusiness(uuid: string) {
    const { data, error } = await this.supabase
      .from("business")
      .select("*")
      .eq("profile_id", uuid);
    return { data, error };
  }

  async getUserBusinessEdits(uuid: string) {
    const { data, error } = await this.supabase
      .from("business_edits")
      .select("*")
      .eq("profile_id", uuid);
    return { data, error };
  }

  async addBusiness(businessEntry: BusinessListing, uuid: string) {
    const result = await this.getUserBusiness(uuid);
    businessEntry.profile_id = uuid;
    if (result.error) {
      console.error("Error fetching business listings:", result.error);
      return { data: undefined, error: result.error };
    }

    let response;
    if (result.data && result.data.length > 0) {
      if (result.data[0].approved) {
        response = await this.supabase
          .from("business_edits")
          .insert([businessEntry]);
      } else {
        response = await this.supabase.from("business").update([businessEntry]);
      }
    } else {
      response = await this.supabase.from("business").insert([businessEntry]);
    }

    return {
      data: response.data ? response.data[0] : undefined,
      error: response.error,
    };
  }

  async deleteBusinessListing(uuid: string) {
    const { error } = await this.supabase
      .from("business")
      .delete()
      .eq("profile_id", uuid);
    return !error;
  }

  async deleteBusinessEditListing(uuid: string) {
    const { error } = await this.supabase
      .from("business_edits")
      .delete()
      .eq("profile_id", uuid);
    return !error;
  }

  async replaceBusiness(uuid: string) {
    const result = await this.supabase
      .from("business_edits")
      .select("*")
      .eq("profile_id", uuid);
    if (result.error) {
      console.error("Error fetching business edits:", result.error);
      return { data: undefined, error: result.error };
    } else {
      const businessEdit = result.data![0];
      const { data, error } = await this.supabase
        .from("business")
        .update(businessEdit)
        .eq("profile_id", uuid);
      if (error) {
        throw error;
      } else {
        await this.deleteBusinessEditListing(uuid);
        return data;
      }
    }
  }

  async updateBusinessApproved(uuid: string, toggleValue: boolean) {
    const { data, error } = await this.supabase
      .from("business")
      .update({ approved: toggleValue })
      .eq("profile_id", uuid);
    if (error) {
      throw error;
    }
    return data;
  }

  async updateBusinessEditApproved(uuid: string, toggleValue: boolean) {
    const { data, error } = await this.supabase
      .from("business_edits")
      .update({ approved: toggleValue })
      .eq("profile_id", uuid);
    if (error) {
      throw error;
    }
    return data;
  }
}
