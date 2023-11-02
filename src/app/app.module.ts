import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { HammerGestureConfig } from '@angular/platform-browser';
import { CustomHammerConfig } from './custom.hammer.config';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { MissionComponent } from './pages/mission/mission.component';
import { MeetComponent } from './pages/meet/meet.component';
import { EventsComponent } from './pages/events/events.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CommunityComponent } from './pages/community/community.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { BusinessComponent } from './pages/business/business.component';
import { JobBoardComponent } from './pages/job-board/job-board.component';
import { ForHireComponent } from './pages/for-hire/for-hire.component';
import { ForHireRequestComponent } from './components/for-hire-request/for-hire-request.component';
import { AccountComponent } from './pages/account/account.component';
import { RegisterBusinessComponent } from './components/register-business/register-business.component';
import { RegisterJobBoardComponent } from './components/register-job-board/register-job-board.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MissionComponent,
    MeetComponent,
    EventsComponent,
    ContactComponent,
    FooterComponent,
    ScrollToTopComponent,
    AdminComponent,
    CommunityComponent,
    RegisterComponent,
    LoginComponent,
    BusinessComponent,
    JobBoardComponent,
    ForHireComponent,
    ForHireRequestComponent,
    AccountComponent,
    RegisterBusinessComponent,
    RegisterJobBoardComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
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
  ],
  providers: [
    {
      provide: HammerGestureConfig,
      useClass: CustomHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
