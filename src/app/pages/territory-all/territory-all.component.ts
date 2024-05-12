import { Component } from '@angular/core';
import { MapMarker, MarkerColor } from '../../components/map/map.component';
import { TerritoryCard } from '../../models/territory-card.model';
import { TerritoryService } from '../../services/territory/territory.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-territory-all',
  templateUrl: './territory-all.component.html',
  styleUrl: './territory-all.component.scss'
})
export class TerritoryAllComponent {
  table = JSON.parse(localStorage.getItem('CardTable') || '{}');
  colors = this.randomColors();
  markers: MapMarker[] = [];

  constructor(private territory: TerritoryService){
    this.loadMarksFromLocalStorage();
    this.loadMarksFromApi();
  }

  loadMarksFromApi() {
    this.territory.cards$.pipe(take(1)).subscribe(cards=> {
      cards?.
      filter(x=> !this.table[x])
      .forEach((cardId, index)=> {
        if(!this.table[cardId]){
          setTimeout(()=> this.territory.selectCard(cardId), index * 2000);
        }
      })
    })
  }

  loadMarksFromLocalStorage() {
    const allMackers = [];
    
    for (const cardId in this.table) {
      if (Object.prototype.hasOwnProperty.call(this.table, cardId)) {
        const card = this.table[cardId] as TerritoryCard;
        const colorIndex = (+cardId) % (this.colors.length+1);

        console.log('cardId', cardId);
        console.log('colorIndex', colorIndex);

        const markers = card.directions
        .map((x, i)=> ({index: i+1, ...x}))
        .filter(x => x.lat && x.long)
        .map(x => ({
          lat: x.lat!!,
          long: x.long!!,
          title: `Direccion ${x.index}`,
          iconText: `Tarjeta ${cardId}`,
          color: this.colors[colorIndex]
        }));

        allMackers.push(...markers);
      }
    }
    this.markers = allMackers;
  }

  randomColors() {
    return [
      MarkerColor.Blue,
      MarkerColor.Green,
      MarkerColor.Red,
      MarkerColor.Purple
    ].sort(() => Math.random() - 0.5)
  }
}
