import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingAssignmentsService {

  constructor(private readonly http: HttpClient) { }

  public get(){
      return this.http.get<string[][]>(environment.api2 + "/meetings/assignment")
        .pipe(take(1));
    }
}
