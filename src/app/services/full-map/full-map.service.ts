import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, pipe, tap } from 'rxjs';
import { TerritoryMapMarker } from '../../models/territory-mark.model';

@Injectable({
  providedIn: 'root'
})
export class FullMapService extends BaseService {
  _$ = new BehaviorSubject<TerritoryMapMarker[]>(
    JSON.parse(sessionStorage.getItem('FullMapService') || '[]'));
  constructor(
    auth: AuthService, 
    http: HttpClient) {
      super(auth, http)
  }

  get data$() {
    if (this._$.getValue().length == 0) {
      console.log('api')
      this.get('territory/full_map', true)
        .pipe(tap(x=> sessionStorage.setItem('FullMapService', JSON.stringify(x))))
        .subscribe(data=> this._$.next(data));
    }
    return this._$.asObservable();
  }
}
