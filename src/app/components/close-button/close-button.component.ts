import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-close-button',
  templateUrl: './close-button.component.html',
  styleUrl: './close-button.component.scss'
})
export class CloseButtonComponent {
  @Input()
  disabled: any;
  @Output()
  click = new EventEmitter<CloseButtonComponent>()
  
  innerClick() {
    this.click.emit(this);
  }
}
