import { Component } from '@angular/core';
import { MeetingAssignmentsService } from '../../services/meeting-assignments/meeting-assignments.service';

@Component({
  selector: 'app-meeting-assignments',
  templateUrl: './meeting-assignments.component.html',
  styleUrl: './meeting-assignments.component.scss'
})
export class MeetingAssignmentsComponent {
  header: string[] = [];
  meetings: { date: string; brothers: string[]; }[] = [];
  month: any = Date.now();
  limitNames = 12;

  constructor(private readonly service: MeetingAssignmentsService) {
    this.service.get().subscribe(data=> {
      this.header = data[0];
      this.meetings = data.slice(1).map(x=> ({
        date: x[0],
        brothers: x.slice(1)
      }));
      this.month = this.meetings[0].date;
    })
  }
}
