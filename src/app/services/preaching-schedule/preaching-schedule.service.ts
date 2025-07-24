import { Injectable } from '@angular/core';
import { PreachingSchedule, PreachingScheduleDay } from '../../models/preaching-schedule.model';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { Api1Service } from '../api1service';

@Injectable({
  providedIn: 'root'
})
export class PreachingScheduleService{

  $reload = new BehaviorSubject(null)

  constructor(
    private readonly api: Api1Service){
  }

  get data$() : Observable<PreachingSchedule> {
    return this.$reload.pipe(
      switchMap(() => this.api.get<PreachingSchedule>('preachingschedule/', true))
    );
  }

  updateFixedDay(fixedDay: PreachingScheduleDay) {
    fixedDay.hour = `${fixedDay.hour}:00`;
    return this.api.post('preachingschedule/fixed-day', fixedDay).pipe(
      tap(() => this.$reload.next(null))
    );
  }
}
