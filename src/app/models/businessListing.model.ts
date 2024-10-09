export interface BusinessListing {
  id?: number;
  profile_id: string;
  company_name: string;
  type: string;
  description: string;
  owner: string;
  email: string;
  phone_number: string;
  location: string;
  image_url: string;
  approved: boolean;
}
