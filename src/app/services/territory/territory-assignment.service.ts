import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { NewTerritoryAssignmentRecord, TerritoryAssignmentPatchRecord, TerritoryAssignmentSheet } from '../../models/territory-assigment.model';

@Injectable({
  providedIn: 'root'
})
export class TerritoryAssignmentService {
  private readonly _sheet$ = new BehaviorSubject<TerritoryAssignmentSheet | null>(null);
  public readonly sheet$ = this._sheet$.asObservable();
  constructor(private readonly http: HttpClient) { }
  
  public refreshSheet(){
    this.http.get<TerritoryAssignmentSheet>("http://localhost:8085/api/territory/assignment")
    .pipe(take(1))
    .subscribe(sheets=> this._sheet$.next(sheets));
  }
  
  recallNext() {
    this._sheet$.next(this._sheet$.value);
  }

  public createRecord(record: NewTerritoryAssignmentRecord){
    return this.http.post("http://localhost:8085/api/territory/assignment/record", record);
  }

  patchRecord(record: TerritoryAssignmentPatchRecord) {
    return this.http.patch("http://localhost:8085/api/territory/assignment/record", record);
  }
}
