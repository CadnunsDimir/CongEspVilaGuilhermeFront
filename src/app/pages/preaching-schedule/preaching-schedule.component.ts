import { Component, OnInit } from '@angular/core';
import { PreachingScheduleService } from '../../services/preaching-schedule/preaching-schedule.service';
import { map } from 'rxjs';
import { PreachingScheduleDay } from '../../models/preaching-schedule.model';

@Component({
  selector: 'app-preaching-schedule',
  templateUrl: './preaching-schedule.component.html',
  styleUrl: './preaching-schedule.component.scss'
})
export class PreachingScheduleComponent implements OnInit {
  
  
  fixedDays$ = this.preachingSchedule.data$.pipe(
    map((data) => data.fixedPreachingDays));
    
    monthAndYear?: string;
    editFixedDay: PreachingScheduleDay | null = null;
    
    constructor(private readonly preachingSchedule: PreachingScheduleService) {
      
    }
    
    ngOnInit(): void {
      const date = new Date();
      
      if (date.getDate() > 20) {
        date.setMonth(date.getMonth() + 1);
        date.setDate(1);      
      }
      
      const year = date.getFullYear();
      const month = new Date().toLocaleString('es-ES', { month: 'long'});
      
      this.monthAndYear = `${month}/${year}`;
    }
    
    onEditFixedDay(fixedDay: PreachingScheduleDay) {
      this.editFixedDay = fixedDay;
    }
    
    saveFixedDay(fixedDay: PreachingScheduleDay) {
      this.preachingSchedule.updateFixedDay(fixedDay).subscribe();
    }
}
