import { Component } from '@angular/core';
import { MapMarker, MarkerColor } from '../../components/map/map.component';
import { Observable, map, take } from 'rxjs';
import { FullMapService } from '../../services/full-map/full-map.service';
import { TerritoryMapMarker } from '../../models/full-map.model';
import { mapBounds } from '../territory-edit/map-bounds';

@Component({
  selector: 'app-territory-all',
  templateUrl: './territory-all.component.html',
  styleUrl: './territory-all.component.scss'
})
export class TerritoryAllComponent {
  colors = this.randomColors();
  markers$: Observable<MapMarker[]> = this.fullMap.data$.pipe(map(markers=> this.loadMarks(markers.mapMarkers)));
  totalDirections$ = this.fullMap.data$.pipe(map(x=>x.totalAdresses));
  poligon = mapBounds;

  constructor(private fullMap: FullMapService){}

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

  randomColors() {
    return [
      MarkerColor.Blue,
      MarkerColor.Green,
      MarkerColor.Red,
      MarkerColor.Purple
    ].sort(() => Math.random() - 0.5)
  }
}


