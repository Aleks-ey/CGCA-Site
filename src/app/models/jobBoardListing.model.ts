export interface JobBoardListing {
  id?: number;
  profile_id: string;
  company_name: string;
  job_title: string;
  job_description: string;
  email: string;
  phone_number: string;
  pay: string;
  location: string;
  approved: boolean;
}
