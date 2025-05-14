import { Component } from '@angular/core';
import { MapMarker, MarkerColor } from '../../components/map/map.component';
import { filter, map } from 'rxjs';
import { FullMapService } from '../../services/full-map/full-map.service';
import { TerritoryMapMarker } from '../../models/full-map.model';
import { mapBounds } from './map-bounds';
import { TerritoryService } from '../../services/territory/territory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-territory-all',
  templateUrl: './territory-all.component.html',
  styleUrl: './territory-all.component.scss'
})
export class TerritoryAllComponent {
  colors = this.randomColors();
  markers$ = this.fullMap.data$.pipe(
    filter(x=>!!x.mapMarkers), 
    map(markers=> this.loadMarks(markers.mapMarkers)));
  totalDirections$ = this.fullMap.data$.pipe(map(x=>x.totalAdresses));
  totalCards$ = this.territory.cards$.pipe(map(x=>x?.length));
  checkCards$ = this.fullMap.data$.pipe(
    map(x=>x.checkCoordinatesOnCards),
    filter(x=> x.length >0));
  poligon = mapBounds;

  constructor(private fullMap: FullMapService,
    private territory: TerritoryService,
    private router: Router
  ){}

  loadMarks(markers: TerritoryMapMarker[]) {
    return markers.map(x=> ({
            lat: x.lat,
            long: x.long,
            title: `Direccion ${x.orderPosition}`,
            iconText: `Tarjeta ${x.cardId}`,
            color: this.getColor(x.cardId)
    } as MapMarker));
  }

  getColor(cardId: number): any {
    const colorIndex = cardId % (this.colors.length+1);
    return this.colors[colorIndex];
  }

  editCard(cardId: number) {
    this.territory.selectCard(cardId);
    this.router.navigate(['/territory']);
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


