import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PublicTalk } from '../../models/weekend.model';

export interface PublicTalkFormData{
  show: boolean,
  date: string,
  moreInfos?: PublicTalk 
}

@Component({
  selector: 'app-public-talk-form',
  templateUrl: './public-talk-form.component.html',
  styleUrl: './public-talk-form.component.scss'
})
export class PublicTalkFormComponent {
  show: boolean = false;

  @Input({
    required: true
  })
  set formData(data: PublicTalkFormData) {
    this.show = data.show;
    this.form.reset();
    this.form.controls.date.setValue(data.date);
    if (data.moreInfos) {
      this.form.setValue(data.moreInfos);
    }
  }

  @Output()
  finishEdition = new EventEmitter();

  form = this.fb.group({
      date: [''],
      speaker: [''],
      publicTalkTheme: [''],
      outlineNumber: ['' as unknown as number],
      isLocal: [false],
      congregation: ['']
  });

  constructor(private readonly fb: FormBuilder) {
    
  }

  save() {
    this.finishEdition.emit(this.form.value);
  }
}
