import { Component, OnInit } from '@angular/core';
import { PreachingScheduleService } from '../../services/preaching-schedule/preaching-schedule.service';
import { map } from 'rxjs';
import { PreachingScheduleDay, SpecialPreachingDay } from '../../models/preaching-schedule.model';

@Component({
  selector: 'app-preaching-schedule',
  templateUrl: './preaching-schedule.component.html',
  styleUrl: './preaching-schedule.component.scss'
})
export class PreachingScheduleComponent implements OnInit {
  
  fixedDays$ = this.preachingSchedule.fixedDays$;
  specialDays$ = this.preachingSchedule.specialDays$;

  monthAndYear?: string;
  editFixedDay: PreachingScheduleDay | null = null;

  constructor(private readonly preachingSchedule: PreachingScheduleService) {

  }

  ngOnInit(): void {
    const { month, year } = this.getMonthAndYear();
    this.monthAndYear = `${month}/${year}`;
  }

  getMonthAndYear(): { month: any; year: any; } {
    const date = new Date();

    if (date.getDate() > 20) {
      date.setMonth(date.getMonth() + 1);
      date.setDate(1);
    }

    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();

    return { month, year }
  }

  onEditFixedDay(fixedDay: PreachingScheduleDay) {
    this.editFixedDay = fixedDay;
  }

  saveFixedDay(fixedDay: PreachingScheduleDay) {
    this.preachingSchedule.updateFixedDay(fixedDay).subscribe();
  }

  onEditSpecialDate(date: SpecialPreachingDay) {
    throw new Error('Method not implemented.');
  }
}
