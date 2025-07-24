import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, tap } from 'rxjs';
import { FullMap } from '../../models/full-map.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CongregationBoundaries } from '../../models/territory-boundaries.model';
import { Api1Service } from '../api1service';

@Injectable({
  providedIn: 'root'
})
export class FullMapService {
  private tableName = 'FullMapService';
  private limitsTableName = "congregation_boundaries";

  private get tableData() {
    return JSON.parse(sessionStorage.getItem(this.tableName) || '{}');
  }

  private set tableData(data: any){
    sessionStorage.setItem(this.tableName, JSON.stringify(data))
  }

  _$ = new BehaviorSubject<FullMap>(this.tableData);

  _boundaries$ = new BehaviorSubject<CongregationBoundaries>(
    JSON.parse(sessionStorage.getItem(this.limitsTableName) || '{}'))

  constructor(
    private readonly api: Api1Service,
    private readonly http: HttpClient
  ) {
  }

  get data$() {    
    return this._$.asObservable();
  }

  update() {
    const currentValue = this._$.getValue() as any;
    if (!currentValue?.mapMarkers) {
      this.api.get('territory/full_map', true)
        .pipe(tap(x=> this.tableData = x))
        .subscribe(data=> this._$.next(data));
    }
  }
  
  clear() {
    sessionStorage.removeItem(this.tableName);
  }

  getCongregationBoundaries(){
    if (!this._boundaries$.value.lastUpdate || this.isPastDays(this._boundaries$.value.lastUpdate, 30)) {
      this.http.get<CongregationBoundaries>(environment.api2 + "/territory")
        .subscribe(x=> {
          x.lastUpdate = new Date(Date.now());
          sessionStorage.setItem(this.limitsTableName, JSON.stringify(x));
          this._boundaries$.next(x);
        });
    }

    return this._boundaries$.asObservable()
      .pipe(
        filter(x=> !!x.bounariesCoordinates),
        map(x=> x.bounariesCoordinates.map(x=> {
          return [+x.latitude, +x.longitude]
        })));
  }

  isPastDays(lastUpdate: Date, days: number): boolean {
    const limitDate = new Date(lastUpdate.valueOf());
    limitDate.setDate(limitDate.getDate() + days);
    return limitDate.valueOf() < Date.now();
  }
}
