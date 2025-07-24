import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { NewTerritoryAssignmentRecord, TerritoryAssignmentPatchRecord, TerritoryAssignmentSheet, TerritoryAssignmentSheetCard } from '../../models/territory-assigment.model';
import { Api2Service } from '../api2.service';

@Injectable({
  providedIn: 'root'
})
export class TerritoryAssignmentService {

  updateLastCompleted(card: TerritoryAssignmentSheetCard) {
    const record: NewTerritoryAssignmentRecord = {
      territoryNumber: card.number,
      completedDate: card.lastDate as any,
      assignedDate: card.lastDate as any,
      assignedTo: 'LAST_COMPLETED_DATE_SERVICE_YEAR'
    };
    
    return this.createRecord(record);
  }
  private readonly _sheet$ = new BehaviorSubject<TerritoryAssignmentSheet | null>(null);
  public readonly sheet$ = this._sheet$.asObservable();
  constructor(private readonly api: Api2Service) { }
  
  public refreshSheet(){
    this.api.get<TerritoryAssignmentSheet>("/territory/assignment")
    .pipe(take(1))
    .subscribe(sheets=> this._sheet$.next(sheets));
  }
  
  recallNext() {
    this._sheet$.next(this._sheet$.value);
  }

  public createRecord(record: NewTerritoryAssignmentRecord){
    return this.api.post("/territory/assignment/record", record, false);
  }

  patchRecord(record: TerritoryAssignmentPatchRecord) {
    return this.api.patch("/territory/assignment/record", record);
  }
}
