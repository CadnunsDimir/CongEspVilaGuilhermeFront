import { Injectable } from '@angular/core';
import { CongApiBaseService } from '../cong-api-base.service';
import { BehaviorSubject, tap } from 'rxjs';
import { FullMap } from '../../models/full-map.model';

@Injectable({
  providedIn: 'root'
})
export class FullMapService {
  private tableName = 'FullMapService';

  private get tableData() {
    return JSON.parse(sessionStorage.getItem(this.tableName) || '{}');
  }

  private set tableData(data: any){
    sessionStorage.setItem(this.tableName, JSON.stringify(data))
  }

  _$ = new BehaviorSubject<FullMap>(this.tableData);
  constructor(
    private readonly api: CongApiBaseService
  ) {
  }

  get data$() {    
    return this._$.asObservable();
  }

  update() {
    const currentValue = this._$.getValue() as any;
    console.log("full_map_cache", currentValue);
    if (!currentValue?.mapMarkers) {
      this.api.get('territory/full_map', true)
        .pipe(tap(x=> this.tableData = x))
        .subscribe(data=> this._$.next(data));
    }
  }
  
  clear() {
    sessionStorage.removeItem(this.tableName);
  }
}
