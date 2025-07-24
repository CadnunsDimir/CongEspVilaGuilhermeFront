import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { CleaningAssingment } from '../../models/cleaning-assingnment.model';
import { Api2Service } from '../api2.service';

@Injectable({
  providedIn: 'root'
})
export class CleaningScheduleService {
  constructor(private readonly api: Api2Service) { }

  public get(){
        return this.api.get<CleaningAssingment[]>("/meetings/cleaning")
          .pipe(take(1));
    }
}
