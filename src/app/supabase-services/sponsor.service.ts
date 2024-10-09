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
    const sponsor = await this.supabase
      .from("sponsors")
      .select("file_name, logo_file_name") // Assuming file_name holds the key to the image in the bucket
      .eq("id", sponsorId)
      .single();

    if (sponsor.data) {
      const { file_name, logo_file_name } = sponsor.data;

      // Delete the image from storage
      const { error: storageError } = await this.supabase.storage
        .from("sponsors")
        .remove([file_name]);

      if (storageError) {
        throw new Error(`Failed to delete image: ${storageError.message}`);
      }

      // Delete the logo from storage
      const { error: logoStorageError } = await this.supabase.storage
        .from("sponsors")
        .remove([logo_file_name]);

      if (logoStorageError) {
        throw new Error(`Failed to delete logo: ${logoStorageError.message}`);
      }

      // Delete the sponsor entry from the database
      const { error: deleteError } = await this.supabase
        .from("sponsors")
        .delete()
        .match({ id: sponsorId });

      if (deleteError) {
        throw new Error(`Failed to delete sponsor: ${deleteError.message}`);
      }
    } else if (sponsor.error) {
      throw new Error(`Failed to find sponsor: ${sponsor.error.message}`);
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
