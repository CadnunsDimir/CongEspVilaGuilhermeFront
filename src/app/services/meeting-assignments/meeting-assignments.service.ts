import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { Api2Service } from '../api2.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingAssignmentsService {

  constructor(private readonly api: Api2Service) { }

  public get(){
      return this.api.get<string[][]>("/meetings/assignment")
        .pipe(take(1));
  }
}
