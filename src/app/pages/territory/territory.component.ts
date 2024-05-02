import { Component, OnInit } from '@angular/core';
import { TerritoryService } from '../../services/territory/territory.service';
import { take, tap } from 'rxjs';
import { MapCoordinates, MapMarker, MarkerColor } from '../../components/map/map.component';
import { marker } from 'leaflet';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { GeocodingService } from '../../services/geocoding/geocoding.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styleUrl: './territory.component.scss'
})
export class TerritoryComponent implements OnInit {
  
  printAsCard = false;
  showCardList = false;
  neighborhood: string | undefined;
  cardId: number | undefined;
  markers: MapMarker[] = [];
  directionToUpdate?: Direction;

  cards$ = this.territory.cards$;
  territoryCard$ = this.territory.territoryCard$.pipe(
    tap(x => {
      this.neighborhood = x?.neighborhood;
      this.cardId = x?.cardId;
      var markers = x?.directions
        .map((x, i) => ({
          index: i + 1,
          ...x
        }))
        .filter(x => x.lat && x.long)
        .map(x => ({
          lat: x.lat!!,
          long: x.long!!,
          title: `${x.index} - ${x.streetName}, ${x.houseNumber}`,
          iconText: x.index.toString(),
          color: this.colorByIndex(x.index)
        })) || [];
      this.markers = markers;
    })
  );
  
  constructor(
    private router: Router,
    private territory: TerritoryService,
    private geocoding: GeocodingService,
    private notify: NotificationsService
  ) { }

  ngOnInit() { }

  selectCard(cardId: number) {
    this.showCardList = false;
    this.territory.selectCard(cardId);
  }

  selectDirection(direction: Direction) {
    if (direction != this.directionToUpdate){
      this.directionToUpdate = direction;
      this.notify.send({
        message: "Seleccione un local en el mapa para actualizar la posicion del marcador ou clique novamente en la direccion para cancelar",
        type: 'warning',
        timeout: 10000
      })
    }
    else
      this.directionToUpdate = undefined;
  }

  

  updateCoordinates(coordinates: MapCoordinates) {
    if (this.directionToUpdate) {
      this.directionToUpdate.lat = coordinates.lat;
      this.directionToUpdate.long = coordinates.long;

      this.territory.updateCoordinatesOnCardInMemory(this.directionToUpdate);
      this.directionToUpdate = undefined;
    }
  }

  updateUsingAddress() {
    this.geocoding.getCoordinates(this.directionToUpdate!!, this.neighborhood!!)
      .subscribe(coordinates => {
        this.updateCoordinates(coordinates);
      });
  }

  edit() {
    this.territory.territoryCard$.pipe(take(1)).subscribe(card=> {
      sessionStorage.setItem("card", JSON.stringify(card));
      this.router.navigate(['/territory/edit']);
    });
  }

  colorByIndex(index: number): MarkerColor {
    const colors = [
      MarkerColor.Blue,
      MarkerColor.Green,
      MarkerColor.Red,
      MarkerColor.Yellow
    ];

   const colorIndex = colors.length + index - 1;

    return colors[colorIndex % colors.length];
  }
}
