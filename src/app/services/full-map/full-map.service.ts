import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, pipe, tap } from 'rxjs';
import { FullMap, TerritoryMapMarker } from '../../models/full-map.model';

@Injectable({
  providedIn: 'root'
})
export class FullMapService extends BaseService {
  _$ = new BehaviorSubject<FullMap>(
    JSON.parse(sessionStorage.getItem('FullMapService') || '{}'));
  constructor(
    auth: AuthService, 
    http: HttpClient) {
      super(auth, http)
  }

  get data$() {
    const currentValue = this._$.getValue() as any;
    if (!currentValue || currentValue.length || !currentValue.mapMarkers) {
      console.log('api')
      this.get('territory/full_map', true)
        .pipe(tap(x=> sessionStorage.setItem('FullMapService', JSON.stringify(x))))
        .subscribe(data=> this._$.next(data));
    }
    return this._$.asObservable();
  }
}
