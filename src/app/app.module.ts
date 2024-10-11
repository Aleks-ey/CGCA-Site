import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HammerModule } from "@angular/platform-browser";
import { HammerGestureConfig } from "@angular/platform-browser";
import { CustomHammerConfig } from "./custom.hammer.config";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatOptionModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { CommonModule } from "@angular/common";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./pages/home/home.component";
import { MissionComponent } from "./pages/mission/mission.component";
import { MeetComponent } from "./pages/meet/meet.component";
import { EventsComponent } from "./pages/events/events.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ScrollToTopComponent } from "./components/scroll-to-top/scroll-to-top.component";
import { AdminComponent } from "./pages/admin/admin.component";
import { CommunityComponent } from "./pages/community/community.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { BusinessComponent } from "./pages/business/business.component";
import { JobBoardComponent } from "./pages/job-board/job-board.component";
import { ForHireComponent } from "./pages/for-hire/for-hire.component";
import { ForHireRequestComponent } from "./components/for-hire-request/for-hire-request.component";
import { AccountComponent } from "./pages/account/account.component";
import { RegisterBusinessComponent } from "./components/register-business/register-business.component";
import { RegisterJobBoardComponent } from "./components/register-job-board/register-job-board.component";
import { UpdateAccountComponent } from "./components/update-account/update-account.component";
import { AccountLoginComponent } from "./pages/account-login/account-login.component";
import { SponsorsComponent } from "./pages/sponsors/sponsors.component";
import { GalleryComponent } from "./pages/gallery/gallery.component";

import { HeroAComponent } from "./components/hero-components/hero-a/hero-a.component";
import { HeroBComponent } from "./components/hero-components/hero-b/hero-b.component";
import { ForHireListingsComponent } from "./components/community-listings/for-hire-listings/for-hire-listings.component";
import { JobBoardListingsComponent } from "./components/community-listings/job-board-listings/job-board-listings.component";
import { BusinessListingsComponent } from "./components/community-listings/business-listings/business-listings.component";
import { ListingsActionButtonsComponent } from "./components/community-listings/listings-action-buttons/listings-action-buttons.component";
import { ImageDialogComponent } from "./components/utility/image-dialog/image-dialog.component";
import { SponsorUploadComponent } from "./components/sponsor-components/sponsor-upload/sponsor-upload.component";
import { SponsorDeleteComponent } from "./components/sponsor-components/sponsor-delete/sponsor-delete.component";
import { SponsorUpdateComponent } from "./components/sponsor-components/sponsor-update/sponsor-update.component";
import { SponsorLogoCarouselComponent } from "./components/sponsor-components/sponsor-logo-carousel/sponsor-logo-carousel.component";
import { SponsorListComponent } from "./components/sponsor-components/sponsor-list/sponsor-list.component";
import { GalleryUploadComponent } from "./components/gallery-components/gallery-upload/gallery-upload.component";
import { GalleryDisplayComponent } from "./components/gallery-components/gallery-display/gallery-display.component";

@NgModule({
  declarations: [
    AccountComponent,
    AccountLoginComponent,
    AdminComponent,
    AppComponent,
    BusinessComponent,
    CommunityComponent,
    ContactComponent,
    EventsComponent,
    FooterComponent,
    ForHireComponent,
    ForHireRequestComponent,
    HeaderComponent,
    HomeComponent,
    JobBoardComponent,
    LoginComponent,
    MeetComponent,
    MissionComponent,
    RegisterBusinessComponent,
    RegisterComponent,
    RegisterJobBoardComponent,
    ScrollToTopComponent,
    UpdateAccountComponent,
    SponsorsComponent,
    GalleryComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HammerModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatRadioModule,
    MatOptionModule,
    MatSidenavModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    HeroAComponent,
    HeroBComponent,
    ForHireListingsComponent,
    JobBoardListingsComponent,
    BusinessListingsComponent,
    ListingsActionButtonsComponent,
    ImageDialogComponent,
    SponsorUploadComponent,
    SponsorDeleteComponent,
    SponsorUpdateComponent,
    SponsorLogoCarouselComponent,
    SponsorListComponent,
    GalleryUploadComponent,
    GalleryDisplayComponent,
  ],
  providers: [
    {
      provide: HammerGestureConfig,
      useClass: CustomHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
