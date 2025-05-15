import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { PreachingScheduleDay } from '../../../../models/preaching-schedule.model';

@Component({
  selector: 'app-edit-fixed-days-button',
  templateUrl: './edit-fixed-days-button.component.html',
  styleUrl: './edit-fixed-days-button.component.scss'
})
export class EditFixedDaysButtonComponent {
  
  fixedDay: any = { place: {}};

  @Input()
  set editFixedDay(value: PreachingScheduleDay | null) {
    this.fixedDay = value;
    if (value) {
      this.fixedDay = JSON.parse(JSON.stringify(value));
      this.fixedDay.hour = value.hour.slice(0, 5);
      this.showModal = true;
    }
  }

  @Output()
  save = new EventEmitter<PreachingScheduleDay>();
  showModal: boolean = false;

  get valid() :boolean {
    return this.fixedDay.dayOfWeek && 
      this.fixedDay.hour && 
      this.fixedDay.fieldOverseer && 
      this.fixedDay.place.name &&
      this.fixedDay.place.adress;
  }

  openModal() {
    this.fixedDay = { place: {}};
    this.showModal = true;
  }
  saveChanges() {    
    this.save.emit(this.fixedDay);
    this.showModal = false;
  }
  closeModal() {
    this.showModal = false;
  }
}
