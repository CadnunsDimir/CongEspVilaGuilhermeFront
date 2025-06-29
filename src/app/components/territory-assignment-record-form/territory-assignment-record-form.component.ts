import { NewTerritoryAssignmentRecord, TerritoryAssignmentPatchRecord } from './../../models/territory-assigment.model';
import { Component, OnInit } from '@angular/core';
import { TerritoryAssignmentService } from '../../services/territory/territory-assignment.service';
import { TerritoryService } from '../../services/territory/territory.service';
import { TerritoryAssignmentRecordFormService } from '../../services/territory/territory-assignment-record-form.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-territory-assignment-record-form',
  templateUrl: './territory-assignment-record-form.component.html',
  styleUrl: './territory-assignment-record-form.component.scss'
})
export class TerritoryAssignmentRecordFormComponent implements OnInit {
  cards$ = this.territory.cards$;
  showForm$ = this.formService.show$;
  form = this.fb.group({
    recordId: [],
    territoryNumber: ['', Validators.required],
    assignedTo: ['', Validators.required],
    assignedDate: ['', Validators.required],
    completedDate: ['']
  });
  disabledControlsOnEdit = ['assignedDate', 'assignedTo', 'territoryNumber'];

  get action() {
    return this.form.value.recordId ? 'Editar' : 'Adicionar'
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly assingment: TerritoryAssignmentService,
    private readonly territory: TerritoryService,
    private readonly formService: TerritoryAssignmentRecordFormService) {
  }

  ngOnInit(): void {
    this.formService.updatingRecord$.subscribe(record => {
      console.log(record);
      this.form.setValue(record);
      this.disabledControlsOnEdit.forEach(x => (this.form.controls as any)[x].disable());
    });
    
    this.formService.territoryNumber$
      .subscribe(x=> this.form.controls.territoryNumber.setValue(x))
  }

  save() {
    if (this.form.valid) {
      const isEditMode = !!this.form.value.recordId;
      if (isEditMode) {
        const { recordId, completedDate } = this.form.value;
        this.patchRecord({ recordId, completedDate });
      } else {
        this.createRecord();
      }
    }
  }

  patchRecord(record: TerritoryAssignmentPatchRecord) {
    this.assingment.patchRecord(record)
      .subscribe(() => this.afterSubmit());
  }

  createRecord() {
    this.assingment.createRecord(this.form.value as unknown as NewTerritoryAssignmentRecord)
      .subscribe(() => this.afterSubmit());
  }

  afterSubmit() {
    this.formService.submitFinished();
    this.resetForm();
  }

  resetForm() {
    this.form.reset();
    this.disabledControlsOnEdit.forEach(x => (this.form.controls as any)[x].enable());
  }

  closeForm() {
    this.resetForm();
    this.formService.closeForm();
  }
}
