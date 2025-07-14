import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WeekendMeetingService } from '../../services/meeting-assignments/weekend-meeting.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-inline',
  templateUrl: './edit-inline.component.html',
  styleUrl: './edit-inline.component.scss'
})
export class EditInlineComponent {
  brothers: string[] = [];
  editing = false;
  selectedBrother: string = '';

  @Input({ required: true })
  set type(typeCode: 'president' | 'reader'){
    const map = {
      president: () => this.service.allowedAsPresident$,
      reader: ()=> this.service.allowedAsReader$
    };

    this.service.loadBrothers()
      .pipe(
        switchMap(()=> map[typeCode]()))
      .subscribe(x=> this.brothers = x);
  }

  @Output()
  finishEditing = new EventEmitter<string>()

  constructor(private readonly service: WeekendMeetingService) {}

  endEditing() {
    this.editing = false;
    this.finishEditing.emit(this.selectedBrother);
  }
}
