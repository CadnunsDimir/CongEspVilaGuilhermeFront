import { Direction } from './../../models/territory-card.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-directions-table',
  templateUrl: './directions-table.component.html',
  styleUrl: './directions-table.component.scss',  
})
export class DirectionsTableComponent {
  @Input() printAsCard?: boolean;
  @Input() territoryCard$?: Observable<any>;
  @Input() directionToUpdate?: Direction;
  @Output() selected = new EventEmitter<Direction>();
  maxItensPerTable = 20;
  showOptions?: Direction;
  onClickRow(direction: Direction){
    if(this.directionToUpdate != direction){
      this.showOptions = direction
    }else{
      this.selected.emit(direction);
    }
  }
}
