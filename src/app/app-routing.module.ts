import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { BusinessComponent } from './pages/business/business.component';
import { ForHireComponent } from './pages/for-hire/for-hire.component';
import { HomeComponent } from './pages/home/home.component';
import { JobBoardComponent } from './pages/job-board/job-board.component';
import { MissionComponent } from './pages/mission/mission.component';
import { MeetComponent } from './pages/meet/meet.component';
import { EventsComponent } from './pages/events/events.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CommunityComponent } from './pages/community/community.component';
import { AccountComponent } from './pages/account/account.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'mission',
    component: MissionComponent
  },
  {
    path: 'meet',
    component: MeetComponent
  },
  {
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path:'community',
    component: CommunityComponent
  },
  {
    path: 'business',
    component: BusinessComponent
  },
  {
    path: 'job-board',
    component: JobBoardComponent
  },
  {
    path: 'for-hire',
    component: ForHireComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
