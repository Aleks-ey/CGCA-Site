import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ImageUploadService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Function to upload a single file to a specified bucket
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      console.error("Upload error:", error.message);
      throw new Error(error.message);
    }

    // Constructing the URL to access the uploaded file
    return `${environment.supabaseUrl}/storage/v1/object/public/${bucket}/${data.path}`;
  }

  // Function to upload multiple files to a specified bucket
  async uploadMultipleFiles(
    bucket: string,
    files: { path: string; file: File }[]
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(bucket, file.path, file.file)
    );
    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error("Bulk upload error:", error);
      throw new Error("Failed to complete all uploads");
    }
  }

  // Function to delete a file from a specified bucket
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Delete error:", error.message);
      throw new Error(error.message);
    }
  }
}
