export interface Sponsor {
  id?: number;
  sponsor: string;
  description: string;
  location: string | null;
  phone: string;
  website: string | null;
  image_url: string | null;
  file_name: string | null;
  custom_file_name: string | null;
  logo_url: string | null;
  logo_file_name: string | null;
  custom_logo_file_name: string | null;
}
