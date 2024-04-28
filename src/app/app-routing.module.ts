import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authenticationGuard } from './auth/authentication.guard';
import { LoginComponent } from './pages/login/login.component';
import { TerritoryComponent } from './pages/territory/territory.component';
import { TerritoryEditComponent } from './pages/territory-edit/territory-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authenticationGuard()] },
  { path: 'territory', component: TerritoryComponent, canActivate: [authenticationGuard()] },
  { path: 'territory/edit', component: TerritoryEditComponent, canActivate: [authenticationGuard()] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
