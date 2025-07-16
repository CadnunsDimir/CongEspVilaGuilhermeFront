import { Component, OnInit } from '@angular/core';
import { TerritoryAssignmentService } from '../../services/territory/territory-assignment.service';
import { map } from 'rxjs';
import { TerritoryAssignmentRecord, TerritoryAssignmentSheet, TerritoryAssignmentSheetCard } from '../../models/territory-assigment.model';
import { TerritoryService } from '../../services/territory/territory.service';
import { TerritoryAssignmentRecordFormService } from '../../services/territory/territory-assignment-record-form.service';

@Component({
  selector: 'app-territory-assignment',
  templateUrl: './territory-assignment.component.html',
  styleUrl: './territory-assignment.component.scss'
})
export class TerritoryAssignmentComponent implements OnInit{
  cards$ = this.assingment.sheet$.pipe(map(x=> this.mapCards(x)));
  serviceYear$ = this.assingment.sheet$.pipe(map(x=> x?.serviceYear));
  totalPages$ = this.assingment.sheet$.pipe(map(x=> x?.totalPages));
  numbers = [...Array(4).keys()];
  fullCardList: number[] = [];
  currentPage = 1;

  constructor(
    private readonly assingment: TerritoryAssignmentService,
    private readonly territory: TerritoryService,
    private readonly form: TerritoryAssignmentRecordFormService) {
  }

  ngOnInit(): void {
    this.territory.cards$.subscribe(cards=> {
      if (cards) {
        this.fullCardList = cards;
        this.assingment.refreshSheet();
      }
    });

    this.form.submitFinished$.subscribe(()=> 
      this.assingment.refreshSheet()
    );
  }

  mapCards(sheets: TerritoryAssignmentSheet | null): TerritoryAssignmentSheetCard[] {
    return this.fullCardList.map(x=> {
      const savedCard = sheets?.numbers.find(n=> n.number === x);
      const lastDate = this.getLastDatebyPage(savedCard?.records || [], sheets?.itensPerPage ?? 4, this.currentPage, sheets?.lastCompletedDate[x]);
      return {
        number: x,
        lastDate,
        records: this.paginate(savedCard?.records || [], sheets?.itensPerPage ?? 4, this.currentPage)
      }
    });
  }
  
  getLastDatebyPage(record: TerritoryAssignmentRecord[], itensPerPage: number, currentPage: number, defaultValue: string | undefined) {
    if (currentPage > 1) {
      const lastPage = this.paginate(record, itensPerPage, currentPage - 1)
        .filter(x=> x.completedDate);
      if (lastPage.length) {
        return lastPage[lastPage.length - 1].completedDate;
      }

      if (record.length) {
        const lastRecord = record[record.length - 1];
        if (lastRecord.completedDate) {
          return lastRecord.completedDate;
        }
      }
    }

    return defaultValue;
  }

  paginate(records: any[], itensPerPage: number, currentPage: number): any[] {
    const beginIndex = (currentPage - 1) * itensPerPage;
    const endIndex = beginIndex + itensPerPage;
    const filteredRecords = records.filter((_, i) => i>= beginIndex && i < endIndex);
    return [...Array(itensPerPage).keys()].map((_, i)=>{
      return filteredRecords[i] ?? {}
    });
  }

  showForm() {
    this.form.openForm();
  }

  nextPage() {
    this.currentPage++;
    this.assingment.recallNext();
  }

  previousPage() {
    this.currentPage--;
    this.assingment.recallNext();
  }

  lastDateClick(card: TerritoryAssignmentSheetCard) {
    if (!card.lastDate) {
      card.editLastDate = !card.editLastDate
    }
  }
  
  submitLastDateEdit(card: TerritoryAssignmentSheetCard) {
    this.assingment.updateLastCompleted(card).subscribe(()=>{
      this.assingment.refreshSheet();
    });
  }


  clickRecord(record: any, territoryNumber: number) {
    if(record.recordId){
      this.form.edit({
        ...record,
        territoryNumber
      });
    }else{
      this.form.openFormWithTerritoryNumber(territoryNumber);
    }
  }

}
