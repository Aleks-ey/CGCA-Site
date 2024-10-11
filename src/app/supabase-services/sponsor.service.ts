import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";
import { Sponsor } from "../models/sponsor.model";

@Injectable({
  providedIn: "root",
})
export class SponsorService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getAllSponsors() {
    const { data, error } = await this.supabase.from("sponsors").select("*");
    return { data, error };
  }

  async getSponsor(sponsorId: number) {
    const { data, error } = await this.supabase
      .from("sponsors")
      .select("*")
      .eq("id", sponsorId)
      .single();
    return { data, error };
  }

  async addSponsor(sponsor: Sponsor) {
    const { data, error } = await this.supabase
      .from("sponsors")
      .insert([sponsor]);
    if (error) throw error;
    return data;
  }

  async deleteSponsor(sponsorId: number): Promise<void> {
    const { data: sponsor, error } = await this.getSponsor(sponsorId);

    if (sponsor) {
      // Delete the sponsor entry from the database
      const { error: deleteError } = await this.supabase
        .from("sponsors")
        .delete()
        .match({ id: sponsorId });

      if (deleteError) {
        throw new Error(`Failed to delete sponsor: ${deleteError.message}`);
      }
    } else if (error) {
      throw new Error(`Failed to find sponsor: ${error.message}`);
    }
  }

  async updateSponsor(sponsorId: number, updatedData: Sponsor): Promise<void> {
    // Update Sponsor Data in the Database
    const { data, error } = await this.supabase
      .from("sponsors")
      .update({
        sponsor: updatedData.sponsor,
        description: updatedData.description,
        location: updatedData.location,
        phone: updatedData.phone,
        website: updatedData.website,
        image_url: updatedData.image_url,
        file_name: updatedData.file_name,
        logo_url: updatedData.logo_url,
        logo_file_name: updatedData.logo_file_name,
      })
      .match({ id: sponsorId });

    if (error) {
      throw error;
    }

    console.log("Sponsor updated successfully:", data);
  }
}
