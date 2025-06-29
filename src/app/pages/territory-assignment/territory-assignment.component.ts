import { Component, OnInit } from '@angular/core';
import { TerritoryAssignmentService } from '../../services/territory/territory-assignment.service';
import { map } from 'rxjs';
import { TerritoryAssignmentSheet, TerritoryAssignmentSheetCard } from '../../models/territory-assigment.model';
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
      return {
        number: x,
        lastDate: savedCard?.lastDate,
        records: this.paginate(savedCard?.records || [], sheets?.itensPerPage ?? 4, this.currentPage)
      }
    });
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
