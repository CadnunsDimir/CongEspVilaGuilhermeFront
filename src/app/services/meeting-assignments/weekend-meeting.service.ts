import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, take, tap } from 'rxjs';
import { AllowedBrothersOnWeekend, PublicTalk, WeekendMeeting, WeekendMeetingMonth } from '../../models/weekend.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeekendMeetingService {
  
  private readonly subject = new BehaviorSubject<WeekendMeetingMonth[]>([]);
  weeks$ =  this.subject.asObservable();

  private readonly brothers = new BehaviorSubject<AllowedBrothersOnWeekend | null>(null);
  allowedAsPresident$ = this.brothers.asObservable().pipe(
    filter(x=> !!x && !!x.asPresident.length),
    map(x=> x?.asPresident as string[]));
  allowedAsReader$ = this.brothers.asObservable().pipe(
    filter(x=> !!x && !!x.asReader.length),
    map(x=> x?.asReader as string[]));

  constructor(private readonly http: HttpClient) {}

  refresh(){
    this.subject.next([]);
    this.http.get<WeekendMeeting[]>(environment.api2 + "/meetings/weekends")
      .pipe(
        take(1),
        map(x=> this.groupByMonth(x)))
      .subscribe(x=> this.subject.next(x));
  }

  groupByMonth(weeks: WeekendMeeting[]): WeekendMeetingMonth[]{
    const months: WeekendMeetingMonth[] = [];
    
    weeks.forEach(w =>{
      const dateArray = w.date.split("-");
      dateArray[2] = "01";
      const monthKey = dateArray.join("-")
      let month = months.filter(x=> x.month === monthKey)[0];
      if (!month) {
        month = { month: monthKey, weeks: [] };
        months.push(month);
      }
      month.weeks.push(w);
    });
    
    return months;
  }

  updatePublicTalk(publicTalk: PublicTalk) {
    return this.http
      .post<WeekendMeeting[]>(environment.api2 + "/meetings/weekends/public-talk", publicTalk)
      .pipe(take(1));
  }

  loadBrothers() {
    if (!this.brothers.value) {
      this.http.get<AllowedBrothersOnWeekend>(environment.api2 + "/meetings/weekends/brothers")
        .pipe(
          take(1),
          tap(x=> this.brothers.next(x)))
        .subscribe();
    }
    
    return this.brothers
      .asObservable()
      .pipe(
        filter(x=> !x));
  }

  updateAssingments(meeting: any) {
    return this.http
      .put(environment.api2 + "/meetings/weekends/assignments", meeting)
      .pipe(take(1));
  }
}