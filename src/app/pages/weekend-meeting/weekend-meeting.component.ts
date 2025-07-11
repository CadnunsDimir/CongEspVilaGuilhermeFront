import { PublicTalk } from './../../services/meeting-assignments/weekend-meeting.service';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { WeekendMeetingService } from '../../services/meeting-assignments/weekend-meeting.service';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { PublicTalkFormData } from '../../components/public-talk-form/public-talk-form.component';
import { WeekendMeeting } from '../../models/weekend.model';
    
registerLocaleData(es);

@Component({
  selector: 'app-weekend-meeting',
  templateUrl: './weekend-meeting.component.html',
  styleUrl: './weekend-meeting.component.scss',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class WeekendMeetingComponent implements OnInit{
    
  weeks$ = this.service.weeks$;
  formData: PublicTalkFormData = {
    show: false,
    date: Date.now().toString()
  };

  constructor(private readonly service: WeekendMeetingService) {
  }
  
  ngOnInit(): void {
    this.service.refresh();
  }

  updatePublicTalk(week: WeekendMeeting) {
    let moreInfos: PublicTalk | undefined = undefined;

    if (week.publicTalkTheme) {
      moreInfos = {
        congregation: week.speakerCongregation,
        date: week.date,
        isLocal: week.speakerCongregation === 'Arreglo Local',
        outlineNumber: week.outlineNumber,
        publicTalkTheme: week.publicTalkTheme,
        speaker: week.speaker
      }
    }

    this.formData = {
      show: true,
      date: week.date,
      moreInfos
    };
  }

  finishEdition($event: any) {
    console.log($event);
    this.service.updatePublicTalk($event)
      .subscribe(()=> {
        this.formData = {
          show: false,
          date: this.formData.date
        };
        this.service.refresh();
      });
  }
}
