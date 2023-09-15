import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MissionComponent } from './pages/mission/mission.component';
import { MeetComponent } from './pages/meet/meet.component';
import { EventsComponent } from './pages/events/events.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
},
{
  path: '',
  redirectTo: '/home',
  pathMatch: 'full'
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
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
