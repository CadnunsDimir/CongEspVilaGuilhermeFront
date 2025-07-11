import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { WeekendMeeting } from '../../models/weekend.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface WeekendMeetingMonth {
  month: string,
  weeks: WeekendMeeting[]
}

export interface PublicTalk {
  date: string,
  speaker: string,
  publicTalkTheme: string,
  outlineNumber: number,
  isLocal: boolean,
  congregation: string
}

@Injectable({
  providedIn: 'root'
})
export class WeekendMeetingService {
  private readonly subject = new BehaviorSubject<WeekendMeetingMonth[]>([]);
  weeks$ =  this.subject.asObservable();

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
}