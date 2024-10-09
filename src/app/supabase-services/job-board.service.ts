import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";
import { JobBoardListing } from "src/app/models/jobBoardListing.model";

@Injectable({
  providedIn: "root",
})
export class JobBoardService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getAllJobs() {
    const { data, error } = await this.supabase.from("job_board").select("*");
    return { data, error };
  }

  async getAllJobEdits() {
    const { data, error } = await this.supabase
      .from("job_board_edits")
      .select("*");
    return { data, error };
  }

  async getUserJobs(uuid: string) {
    const { data, error } = await this.supabase
      .from("job_board")
      .select("*")
      .eq("profile_id", uuid);
    return { data, error };
  }

  async getUserJobEdits(uuid: string) {
    const { data, error } = await this.supabase
      .from("job_board_edits")
      .select("*")
      .eq("profile_id", uuid);
    return { data, error };
  }

  async addJobBoard(jobBoardEntry: JobBoardListing, uuid: string) {
    const result = await this.getUserJobs(uuid);
    jobBoardEntry.profile_id = uuid;
    if (result.error) {
      console.error("Error fetching job board entries:", result.error);
      return { data: undefined, error: result.error };
    } else {
      let response;
      if (result.data && result.data.length > 0) {
        if (result.data[0].approved) {
          response = await this.supabase
            .from("job_board_edits")
            .insert([jobBoardEntry]);
        } else {
          response = await this.supabase
            .from("job_board")
            .update([jobBoardEntry]);
        }
      } else {
        response = await this.supabase
          .from("job_board")
          .insert([jobBoardEntry]);
      }

      return {
        data: response.data ? response.data[0] : undefined,
        error: response.error,
      };
    }
  }

  async deleteJobBoardListing(uuid: string) {
    const { error } = await this.supabase
      .from("job_board")
      .delete()
      .eq("profile_id", uuid);
    return !error;
  }

  async deleteJobBoardEditListing(uuid: string) {
    const { error } = await this.supabase
      .from("job_board_edits")
      .delete()
      .eq("profile_id", uuid);
    return !error;
  }

  async replaceJobBoard(uuid: string) {
    const result = await this.supabase
      .from("job_board_edits")
      .select("*")
      .eq("profile_id", uuid);
    if (result.error) {
      console.error("Error replacing job board edit:", result.error);
      return { data: undefined, error: result.error };
    } else {
      const jobBoardEdit = result.data![0];
      const { data, error } = await this.supabase
        .from("job_board")
        .update(jobBoardEdit)
        .eq("profile_id", uuid);
      if (error) {
        throw error;
      } else {
        await this.deleteJobBoardEditListing(uuid);
        return data;
      }
    }
  }

  async updateJobBoardApproved(uuid: string, toggleValue: boolean) {
    const { data, error } = await this.supabase
      .from("job_board")
      .update({ approved: toggleValue })
      .eq("profile_id", uuid);
    if (error) {
      throw error;
    }
    return data;
  }

  async updateJobBoardEditApproved(uuid: string, toggleValue: boolean) {
    const { data, error } = await this.supabase
      .from("job_board_edits")
      .update({ approved: toggleValue })
      .eq("profile_id", uuid);
    if (error) {
      throw error;
    }
    return data;
  }
}
