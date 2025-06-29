import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerritoryAssignmentRecordFormService {
  private readonly state$ = new BehaviorSubject<{
    show: boolean,
    submitFinished: boolean,
    territoryNumber: any,
    updatingRecord: any
  }>({
    show: false,
    submitFinished: false,
    territoryNumber: undefined,
    updatingRecord: undefined
  });

  show$ = this.state$.asObservable().pipe(map(x => x.show || !!x.updatingRecord));
  submitFinished$ = this.state$.asObservable().pipe(
    filter(x => x.submitFinished),
    map(x => x.submitFinished));
  updatingRecord$ = this.state$.asObservable().pipe(
    filter(x => !!x.updatingRecord),
    map(x => x.updatingRecord));
  territoryNumber$ = this.state$.asObservable().pipe(
    filter(x=> x.show),
    map(x => x.territoryNumber));

  constructor() { }

  openForm() {
    this.state$.next({
      ...this.state$.value,
      territoryNumber: undefined,
      show: true
    });
  }

  openFormWithTerritoryNumber(territoryNumber: number) {
    this.state$.next({
      ...this.state$.value,
      territoryNumber,
      show: true
    });
  }

  edit(record: any) {
    this.state$.next({
      ...this.state$.value,
      updatingRecord: record
    });
  }

  closeForm() {
    this.state$.next({
      ...this.state$.value,
      updatingRecord: undefined,
      show: false
    });
  }

  submitFinished(): void {
    this.state$.next({
      ...this.state$.value,
      updatingRecord: undefined,
      show: false,
      submitFinished: true,
    });

    setTimeout(() => {
      this.state$.next({
        ...this.state$.value,
        submitFinished: false
      });
    });
  }
}
