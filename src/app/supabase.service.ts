import { Injectable } from "@angular/core";
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from "rxjs";
import { ForHireListing } from "src/app/models/forHireListing.model";
import { BusinessListing } from "src/app/models/businessListing.model";
import { JobBoardListing } from "src/app/models/jobBoardListing.model";
import { CalendarEvent } from "./pages/admin/calendarEvent.model";
import { Sponsor } from "./models/sponsor.model";
import { GalleryImage } from "./models/galleryImage.model";

import { AuthService } from "./supabase-services/auth.service";
import { ProfileService } from "./supabase-services/profile.service";
import { EventService } from "./supabase-services/event.service";
import { SponsorService } from "./supabase-services/sponsor.service";
import { GalleryService } from "./supabase-services/gallery.service";
import { ImageUploadService } from "./supabase-services/image-upload.service";
import { ForHireService } from "./supabase-services/for-hire.service";
import { BusinessService } from "./supabase-services/business.service";
import { JobBoardService } from "./supabase-services/job-board.service";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  constructor(
    public authService: AuthService,
    public profileService: ProfileService,
    public eventService: EventService,
    public sponsorService: SponsorService,
    public galleryService: GalleryService,
    public imageUploadService: ImageUploadService,
    public forHireService: ForHireService,
    public businessService: BusinessService,
    public jobBoardService: JobBoardService
  ) {}
  // --------------------------------- AUTH ---------------------------------
  isLoggedIn() {
    return this.authService.isLoggedIn(); // Assuming this method exists in AuthService
  }
  signIn(email: string, password: string) {
    return this.authService.signIn(email, password);
  }
  signOut() {
    return this.authService.signOut();
  }
  signUp(email: string, password: string) {
    return this.authService.signUp(email, password);
  }
  // reset password through email
  resetPassword(email: string) {
    return this.authService.resetPassword(email);
  }
  // --------------------------------- PROFILE ---------------------------------
  getAllProfiles() {
    return this.profileService.getAllProfiles();
  }

  fetchUserId() {
    return this.profileService.fetchUserId();
  }

  getProfile(uuid: string) {
    return this.profileService.getProfile(uuid);
  }

  updateProfileName(uuid: string, name: string) {
    return this.profileService.updateProfileName(uuid, name);
  }

  updateProfilePhone(uuid: string, phone: string) {
    return this.profileService.updateProfilePhone(uuid, phone);
  }

  updateProfileEmail(new_email: string) {
    return this.profileService.updateProfileEmail(new_email);
  }

  updateProfilePassword(new_password: string) {
    return this.profileService.updateProfilePassword(new_password);
  }
  // --------------------------------- FOR HIRE ---------------------------------
  getAllHires() {
    return this.forHireService.getAllHires();
  }

  getAllHireEdits() {
    return this.forHireService.getAllHireEdits();
  }

  getUserHires(uuid: string) {
    return this.forHireService.getUserHires(uuid);
  }

  getUserHireEdits(uuid: string) {
    return this.forHireService.getUserHireEdits(uuid);
  }

  addForHire(forHireEntry: ForHireListing, uuid: string) {
    return this.forHireService.addForHire(forHireEntry, uuid);
  }

  deleteForHireListing(uuid: string) {
    return this.forHireService.deleteForHireListing(uuid);
  }

  deleteForHireEditListing(uuid: string) {
    return this.forHireService.deleteForHireEditListing(uuid);
  }

  replaceForHire(uuid: string) {
    return this.forHireService.replaceForHire(uuid);
  }

  updateHiresApproved(uuid: string, toggleValue: boolean) {
    return this.forHireService.updateHiresApproved(uuid, toggleValue);
  }

  updateHiresEditApproved(uuid: string, toggleValue: boolean) {
    return this.forHireService.updateHiresEditApproved(uuid, toggleValue);
  }
  // --------------------------------- BUSINESS ---------------------------------
  getAllBusiness() {
    return this.businessService.getAllBusiness();
  }

  getAllBusinessEdits() {
    return this.businessService.getAllBusinessEdits();
  }

  getUserBusiness(uuid: string) {
    return this.businessService.getUserBusiness(uuid);
  }

  getUserBusinessEdits(uuid: string) {
    return this.businessService.getUserBusinessEdits(uuid);
  }

  addBusiness(businessEntry: BusinessListing, uuid: string) {
    return this.businessService.addBusiness(businessEntry, uuid);
  }

  deleteBusinessListing(uuid: string) {
    return this.businessService.deleteBusinessListing(uuid);
  }

  deleteBusinessEditListing(uuid: string) {
    return this.businessService.deleteBusinessEditListing(uuid);
  }

  replaceBusiness(uuid: string) {
    return this.businessService.replaceBusiness(uuid);
  }

  updateBusinessApproved(uuid: string, toggleValue: boolean) {
    return this.businessService.updateBusinessApproved(uuid, toggleValue);
  }

  updateBusinessEditApproved(uuid: string, toggleValue: boolean) {
    return this.businessService.updateBusinessEditApproved(uuid, toggleValue);
  }
  // --------------------------------- JOB BOARD ---------------------------------
  getAllJobs() {
    return this.jobBoardService.getAllJobs();
  }

  getAllJobEdits() {
    return this.jobBoardService.getAllJobEdits();
  }

  getUserJobs(uuid: string) {
    return this.jobBoardService.getUserJobs(uuid);
  }

  getUserJobEdits(uuid: string) {
    return this.jobBoardService.getUserJobEdits(uuid);
  }

  addJobBoard(jobBoardEntry: JobBoardListing, uuid: string) {
    return this.jobBoardService.addJobBoard(jobBoardEntry, uuid);
  }

  deleteJobBoardListing(uuid: string) {
    return this.jobBoardService.deleteJobBoardListing(uuid);
  }

  deleteJobBoardEditListing(uuid: string) {
    return this.jobBoardService.deleteJobBoardEditListing(uuid);
  }

  replaceJobBoard(uuid: string) {
    return this.jobBoardService.replaceJobBoard(uuid);
  }

  updateJobBoardApproved(uuid: string, toggleValue: boolean) {
    return this.jobBoardService.updateJobBoardApproved(uuid, toggleValue);
  }

  updateJobBoardEditApproved(uuid: string, toggleValue: boolean) {
    return this.jobBoardService.updateJobBoardEditApproved(uuid, toggleValue);
  }
  // --------------------------------- EVENTS ---------------------------------
  addEvent(event: CalendarEvent) {
    return this.eventService.addEvent(event);
  }

  getAllEvents() {
    return this.eventService.getAllEvents();
  }

  deleteEvent(eventId: number) {
    return this.eventService.deleteEvent(eventId);
  }

  updateEvent(event: CalendarEvent) {
    return this.eventService.updateEvent(event);
  }
  // --------------------------------- SPONSORS ---------------------------------
  getAllSponsors() {
    return this.sponsorService.getAllSponsors();
  }
  getSponsor(sponsorId: number) {
    return this.sponsorService.getSponsor(sponsorId);
  }
  addSponsor(sponsor: Sponsor) {
    return this.sponsorService.addSponsor(sponsor);
  }
  deleteSponsor(sponsorId: number) {
    return this.sponsorService.deleteSponsor(sponsorId);
  }
  updateSponsor(sponsorId: number, sponsorData: Sponsor) {
    return this.sponsorService.updateSponsor(sponsorId, sponsorData);
  }
  // --------------------------------- GALLERY ---------------------------------
  getAllGalleryImages() {
    return this.galleryService.getAllGalleryImages();
  }
  getGalleryImage(galleryImageId: number) {
    return this.galleryService.getGalleryImage(galleryImageId);
  }
  addGalleryImageData(galleryImage: GalleryImage) {
    return this.galleryService.addGalleryImageData(galleryImage);
  }
  deleteGalleryImage(galleryImageId: number) {
    return this.galleryService.deleteGalleryImage(galleryImageId);
  }
  getGalleryImagesPaginated(limit: number, offset: number, events?: string[]) {
    return this.galleryService.getGalleryImagesPaginated(limit, offset, events);
  }
  getAllGalleryEvents() {
    return this.galleryService.getAllGalleryEvents();
  }
  // --------------------------------- IMAGE UPLOADS ---------------------------------
  uploadFile(bucket: string, path: string, file: File) {
    return this.imageUploadService.uploadFile(bucket, path, file);
  }

  uploadMultipleFiles(bucket: string, files: { path: string; file: File }[]) {
    return this.imageUploadService.uploadMultipleFiles(bucket, files);
  }

  deleteFile(bucket: string, path: string) {
    return this.imageUploadService.deleteFile(bucket, path);
  }
}
