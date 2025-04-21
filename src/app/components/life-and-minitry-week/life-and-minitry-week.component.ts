import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LifeAndMinistryWeek } from '../../models/life-and-ministry.model';

@Component({
  selector: 'app-life-and-minitry-week',
  templateUrl: './life-and-minitry-week.component.html',
  styleUrl: './life-and-minitry-week.component.scss'
})
export class LifeAndMinitryWeekComponent {

  @Input()
  week!: LifeAndMinistryWeek;

  @Input()
  pageBreak: boolean = false;

  @Output()
  saving = new EventEmitter<LifeAndMinistryWeek>()

  save() {
    this.saving.emit(this.week);
  }
}
