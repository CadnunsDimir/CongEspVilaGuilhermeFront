import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Direction } from '../../models/territory-card.model';

@Component({
  selector: 'app-directions-table',
  templateUrl: './directions-table.component.html',
  styleUrl: './directions-table.component.scss'
})
export class DirectionsTableComponent {
  @Input() printAsCard?: boolean;
  @Input() territoryCard$?: Observable<any>;
  @Input() directionToUpdate?: Direction;
  @Output() selected = new EventEmitter<Direction>();
}
