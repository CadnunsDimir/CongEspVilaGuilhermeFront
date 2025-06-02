import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CustomInputComponent } from './components/forms/custom-input.component';
import { TerritoryComponent } from './pages/territory/territory.component';
import { MenuComponent } from './components/menu/menu.component';
import { MapComponent } from './components/map/map.component';
import { TerritoryEditComponent } from './pages/territory-edit/territory-edit.component';
import { ToastComponent } from './components/toast/toast.component';
import { TerritoryAllComponent } from './pages/territory-all/territory-all.component';
import { DirectionsTableComponent } from './components/directions-table/directions-table.component';
import { LifeAndMinitryComponent } from './pages/life-and-minitry/life-and-minitry.component';
import { LifeAndMinitryWeekComponent } from './components/life-and-minitry-week/life-and-minitry-week.component';
import { PreachingScheduleComponent } from './pages/preaching-schedule/preaching-schedule.component';
import { DayOfWeekPipe } from './pipes/day-of-week.pipe';
import { EditFixedDaysButtonComponent } from './pages/preaching-schedule/components/edit-fixed-days-button/edit-fixed-days-button.component';
import { CardsListModalComponent } from './pages/territory/components/cards-list-modal/cards-list-modal.component';
import { FilterPipe } from './pipes/filter.pipe';
import { CloseButtonComponent } from './components/close-button/close-button.component';
import { HeaderComponent } from './components/header/header.component';
import { CardsSelectorComponent } from './pages/territory-edit/components/cards-selector/cards-selector.component';

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
    LifeAndMinitryWeekComponent,
    PreachingScheduleComponent,
    DayOfWeekPipe,
    EditFixedDaysButtonComponent,
    CardsListModalComponent,
    FilterPipe,
    CloseButtonComponent,
    HeaderComponent,
    CardsSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    LeafletModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers:[DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
