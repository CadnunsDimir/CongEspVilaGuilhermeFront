import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authenticationGuard } from './auth/authentication.guard';
import { LoginComponent } from './pages/login/login.component';
import { TerritoryComponent } from './pages/territory/territory.component';
import { TerritoryEditComponent } from './pages/territory-edit/territory-edit.component';
import { TerritoryAllComponent } from './pages/territory-all/territory-all.component';
import { LifeAndMinitryComponent } from './pages/life-and-minitry/life-and-minitry.component';
import { PreachingScheduleComponent } from './pages/preaching-schedule/preaching-schedule.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TerritoryAssignmentComponent } from './pages/territory-assignment/territory-assignment.component';
import { MeetingAssignmentsComponent } from './pages/meeting-assignments/meeting-assignments.component';
import { WeekendMeetingComponent } from './pages/weekend-meeting/weekend-meeting.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authenticationGuard()] },
  { path: 'territory', component: TerritoryComponent, canActivate: [authenticationGuard()] },
  { path: 'territory/public/:sharedCardId', component: TerritoryComponent },
  { path: 'territory/edit', component: TerritoryEditComponent, canActivate: [authenticationGuard()] },
  { path: 'territory/all', component: TerritoryAllComponent, canActivate: [authenticationGuard()] },
  { path: 'territory/assignment', component: TerritoryAssignmentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:resetId', component: ResetPasswordComponent },
  { path: 'meetings/life-and-ministry', component: LifeAndMinitryComponent },
  { path: 'meetings/assignments', component: MeetingAssignmentsComponent },
  { path: 'meetings/weekends', component: WeekendMeetingComponent },
  { path: 'preaching-schedule', component: PreachingScheduleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
