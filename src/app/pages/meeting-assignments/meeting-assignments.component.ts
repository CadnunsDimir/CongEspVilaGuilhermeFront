import { Component } from '@angular/core';
import { MeetingAssignmentsService } from '../../services/meeting-assignments/meeting-assignments.service';
import { CleaningScheduleService } from '../../services/meeting-assignments/cleaning-schedule.service';
import { CleaningAssingment } from '../../models/cleaning-assingnment.model';

@Component({
  selector: 'app-meeting-assignments',
  templateUrl: './meeting-assignments.component.html',
  styleUrl: './meeting-assignments.component.scss'
})
export class MeetingAssignmentsComponent {
  header: string[] = [];
  meetings: { date: string; brothers: string[]; }[] = [];
  cleaningList: CleaningAssingment[] = [];
  month: any = Date.now();
  limitNames = 12;


  constructor(
    private readonly service: MeetingAssignmentsService,
    private readonly cleaningSchedule : CleaningScheduleService
  ) {    
    this.loadAssingments();
    this.loadCleaningList();
  }

  loadAssingments() {
    this.service.get().subscribe(data=> {
      this.header = data[0];
      this.meetings = data.slice(1).map(x=> ({
        date: x[0],
        brothers: x.slice(1)
      }));
      this.month = this.meetings[0].date;
    });
  }

  loadCleaningList() {
    this.cleaningSchedule.get().subscribe(x=> this.cleaningList = x);
  }

  abreviate(name: String, index: number) {
    const maxWords = [2, 3].includes(index) ? 1 : 2;
    const nameArray = name.split(" ").filter((_, i)=> i < maxWords);
    return nameArray.join(" ");
  }
}
