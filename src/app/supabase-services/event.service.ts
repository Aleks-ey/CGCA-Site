import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";
import { CalendarEvent } from "../pages/admin/calendarEvent.model";

@Injectable({
  providedIn: "root",
})
export class EventService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async addEvent(event: CalendarEvent) {
    const { data, error } = await this.supabase.from("events").insert([event]);
    return {
      data: data ? data[0] : undefined, // Assuming 'data' is an array, return the first element.
      error,
    };
  }

  async getAllEvents() {
    const { data, error } = await this.supabase.from("events").select("*");
    return { data, error };
  }

  async deleteEvent(eventId: number) {
    const { data, error } = await this.supabase
      .from("events")
      .delete()
      .match({ id: eventId });
    return { data, error };
  }

  async updateEvent(event: CalendarEvent) {
    const { data, error } = await this.supabase
      .from("events")
      .update(event)
      .match({ id: event.id });
    return { data, error };
  }
}
