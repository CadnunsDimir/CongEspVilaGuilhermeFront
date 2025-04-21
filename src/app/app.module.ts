import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from './components/forms/custom-input.component';
import { TerritoryComponent } from './pages/territory/territory.component';
import { MenuComponent } from './components/menu/menu.component';
import { MapComponent } from './components/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TerritoryEditComponent } from './pages/territory-edit/territory-edit.component';
import { ToastComponent } from './components/toast/toast.component';
import { TerritoryAllComponent } from './pages/territory-all/territory-all.component';
import { DirectionsTableComponent } from './components/directions-table/directions-table.component';
import { LifeAndMinitryComponent } from './pages/life-and-minitry/life-and-minitry.component';
import { LifeAndMinitryWeekComponent } from './components/life-and-minitry-week/life-and-minitry-week.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CustomInputComponent,
    TerritoryComponent,
    MenuComponent,
    MapComponent,
    TerritoryEditComponent,
    ToastComponent,
    TerritoryAllComponent,
    DirectionsTableComponent,
    LifeAndMinitryComponent,
    LifeAndMinitryWeekComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    LeafletModule,
    FormsModule
  ],
  providers:[DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
