import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, pipe, tap } from 'rxjs';
import { FullMap, TerritoryMapMarker } from '../../models/full-map.model';
import { LoaderService } from '../loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class FullMapService extends BaseService {
  

  private tableName = 'FullMapService';

  private get tableData() {
    return JSON.parse(sessionStorage.getItem(this.tableName) || '{}');
  }

  private set tableData(data: any){
    sessionStorage.setItem(this.tableName, JSON.stringify(data))
  }

  _$ = new BehaviorSubject<FullMap>(this.tableData);
  constructor(
    auth: AuthService, 
    http: HttpClient,
    loader: LoaderService
  ) {
      super(auth, http, loader)
  }

  get data$() {
    const currentValue = this._$.getValue() as any;
    if (!currentValue || currentValue.length || !currentValue.mapMarkers) {
      this.get('territory/full_map', true)
        .pipe(tap(x=> this.tableData = x))
        .subscribe(data=> this._$.next(data));
    }
    return this._$.asObservable();
  }
  
  clear() {
    sessionStorage.removeItem(this.tableName);
  }
}
