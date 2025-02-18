import { Component } from '@angular/core';
import { LifeAndMinistryWeek } from '../../models/life-and-ministry.model';
import { LifeAndMinistryService } from '../../services/life-and-ministry/life-and-ministry.service';
import { catchError, finalize, of, tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-life-and-minitry',
  templateUrl: './life-and-minitry.component.html',
  styleUrl: './life-and-minitry.component.scss'
})
export class LifeAndMinitryComponent {
  weeks: LifeAndMinistryWeek[] = [];
  initialDate: string | null;
  totalOfWeeks: number = 4;
  savingEntity?: LifeAndMinistryWeek;

  constructor(
    private readonly service: LifeAndMinistryService,
    private readonly notifications: NotificationsService,
    private readonly datePipe: DatePipe) {
    const currentDate = new Date(Date.now());
    const nextMonthDate = `${currentDate.getFullYear()}-${currentDate.getMonth()+2}-01`
    this.initialDate = this.datePipe.transform(nextMonthDate, 'yyyy-MM-dd') ;

    const weeksJson = localStorage.getItem('LifeAndMinistryWeeks');
    if (weeksJson) {
      this.weeks = JSON.parse(weeksJson);
    }
  }

  loadWeeks() {
    if(this.initialDate){
      this.weeks = [];
      this.runServiceCall(this.initialDate);
    }
  }

  runServiceCall(initialDate: string) {
    this.service.getWeek(initialDate)
        .pipe(
          tap(week=> { 
            if(!week.bibleReading){
              week.bibleReading = {};
            }
            this.weeks.push(week);
          }
          ),
          catchError(error=> of({}))
        )
        .subscribe(()=> {
          if(this.weeks.length < this.totalOfWeeks){
            const dateArray = initialDate.split("-").map(x=> +x);
            let nextDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
            nextDate.setDate(nextDate.getDate() + 7);
            const date = this.datePipe.transform(nextDate, 'yyyy-MM-dd')
            this.runServiceCall(date ?? "");
          }else{
            localStorage.setItem('LifeAndMinistryWeeks', JSON.stringify(this.weeks));
          }
        });
  }

  onSave(week: LifeAndMinistryWeek) {
    this.savingEntity = week;

    this.notifications.send({
      message: "Salvando...",
      type: 'info'
    })
    
    this.service.updateWeek(week)
    .pipe(
      tap(data=> {
        if(data.status != 400) {
          this.notifications.send({
            message: "Salvo Com Sucesso!",
            type: 'success'
          });
        }else{
          this.notifications.send({
          message: "Verifique os seguintes campos: "+Object.keys(data.error.errors).join(", "),
          type: 'error',
          timeout: 5000
        });
        }
      }),
      finalize(()=> this.savingEntity = undefined)
    )
    .subscribe();  
  }
}
