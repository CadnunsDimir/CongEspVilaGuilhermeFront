import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { AuthService } from '../auth/auth.service';
import { PreachingSchedule, PreachingScheduleDay } from '../../models/preaching-schedule.model';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreachingScheduleService extends BaseService {

  $reload = new BehaviorSubject(null)

  constructor(
    private readonly _auth: AuthService,
    private readonly _http: HttpClient) {
    super(_auth, _http);
  }

  get data$() : Observable<PreachingSchedule> {
    return this.$reload.pipe(
      switchMap(() => this.get<PreachingSchedule>('preachingschedule/', true))
    );
  }

  updateFixedDay(fixedDay: PreachingScheduleDay) {
    fixedDay.hour = `${fixedDay.hour}:00`;
    return this.post('preachingschedule/fixed-day', fixedDay).pipe(
      tap(() => this.$reload.next(null))
    );
  }
}
