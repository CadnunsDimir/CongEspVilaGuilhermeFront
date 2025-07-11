import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CleaningAssingment } from '../../models/cleaning-assingnment.model';

@Injectable({
  providedIn: 'root'
})
export class CleaningScheduleService {
  constructor(private readonly http: HttpClient) { }

  public get(){
        return this.http.get<CleaningAssingment[]>(environment.api2 + "/meetings/cleaning")
          .pipe(take(1));
    }
}
