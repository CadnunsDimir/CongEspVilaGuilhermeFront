import { Component } from '@angular/core';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { TerritoryService } from '../../services/territory/territory.service';
import { filter, map, take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  $notifications = this.notifications.$all;
  $notFoundCards = this.territory.cards$.pipe(
    take(1), 
    map(list=> this.mapNotFoundMaps(list || [])),
    filter(list=> list.length > 0));
  constructor(private notifications: NotificationsService, private territory: TerritoryService){}

  mapNotFoundMaps(list: number[]): number[] {
    const lastCard = list[list.length-1];

    const notFound: number[] = [];
    for (let card = 1; card <= lastCard; card++) {
      if(!list.includes(card)){
        notFound.push(card);
      }      
    }
    return notFound;
  }
}
