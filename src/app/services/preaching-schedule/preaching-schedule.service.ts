import { Injectable } from '@angular/core';
import { PreachingSchedule, PreachingScheduleDay } from '../../models/preaching-schedule.model';
import { BehaviorSubject, filter, map, Observable, switchMap, tap } from 'rxjs';
import { Api1Service } from '../api1service';

@Injectable({
  providedIn: 'root'
})
export class PreachingScheduleService{
  private readonly $reload = new BehaviorSubject(null);
  private readonly _$data = new BehaviorSubject<PreachingSchedule | null> (null);

  constructor(
    private readonly api: Api1Service){
      this.$reload.pipe(
        switchMap(() => this.api.get<PreachingSchedule>('preachingschedule/', true)),
        tap(x=> this._$data.next(x)))
        .subscribe();
  }

  private get data$() : Observable<PreachingSchedule> {
    return this._$data.asObservable().pipe(filter(x=> !!x)) as any;
  }

  get fixedDays$() {
    return this.data$.pipe(
        map((data) => data.fixedPreachingDays));
  }

  get specialDays$(){
     return this.data$.pipe(
        map((data) => data.specialDays));
  }

  updateFixedDay(fixedDay: PreachingScheduleDay) {
    fixedDay.hour = `${fixedDay.hour}:00`;
    return this.api.post('preachingschedule/fixed-day', fixedDay).pipe(
      tap(() => this.$reload.next(null))
    );
  }
}
