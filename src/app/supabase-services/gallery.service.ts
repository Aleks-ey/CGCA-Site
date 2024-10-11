import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";
import { GalleryImage } from "../models/galleryImage.model";

@Injectable({
  providedIn: "root",
})
export class GalleryService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getAllGalleryImages() {
    const { data, error } = await this.supabase.from("gallery").select("*");
    return { data, error };
  }

  async getGalleryImage(galleryImageId: number) {
    const { data, error } = await this.supabase
      .from("gallery")
      .select("*")
      .eq("id", galleryImageId)
      .single();
    return { data, error };
  }

  async addGalleryImageData(galleryImage: GalleryImage) {
    const { data, error } = await this.supabase
      .from("gallery")
      .insert([galleryImage]);
    if (error) throw error;
    return data;
  }

  async deleteGalleryImage(galleryImageId: number): Promise<void> {
    const { data: image, error } = await this.getGalleryImage(galleryImageId);

    if (image) {
      const { error: dbError } = await this.supabase
        .from("gallery")
        .delete()
        .eq("id", galleryImageId);

      if (dbError) {
        throw new Error(`Failed to delete image: ${dbError.message}`);
      }
    } else if (error) {
      throw new Error(`Failed to find gallery image: ${error.message}`);
    }
  }

  async getGalleryImagesPaginated(
    limit: number,
    offset: number,
    events?: string[]
  ) {
    let query = this.supabase
      .from("gallery")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (events && events.length > 0) {
      query = query.in("event", events); // Apply event filter if events are provided
    }

    const { data, count, error } = await query.order("event", {
      ascending: true,
    });

    if (error) throw error;
    return { data, count };
  }

  async getAllGalleryEvents() {
    // Fetch all the records with event names
    const { data, error } = await this.supabase.from("gallery").select("event");

    if (error) {
      console.error("Error fetching events:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn("No events found.");
      return [];
    }

    // Use JavaScript's Set to filter unique event names
    const uniqueEvents = [
      ...new Set(data.map((item: { event: string }) => item.event)),
    ];
    return uniqueEvents;
  }
}
