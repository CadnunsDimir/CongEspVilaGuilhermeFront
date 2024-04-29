import { Component, OnInit } from '@angular/core';
import { TerritoryService } from '../../services/territory/territory.service';
import { take, tap } from 'rxjs';
import { MapCoordinates, MapMarker } from '../../components/map/map.component';
import { marker } from 'leaflet';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { GeocodingService } from '../../services/geocoding/geocoding.service';
import { Router } from '@angular/router';

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
          iconText: x.index.toString()
        })) || [];
      this.markers = markers;
    })
  );
  
  constructor(
    private router: Router,
    private territory: TerritoryService,
    private geocoding: GeocodingService
  ) { }

  ngOnInit() { }

  selectCard(cardId: number) {
    this.showCardList = false;
    this.territory.selectCard(cardId);
  }

  selectDirection(direction: Direction) {
    if (direction != this.directionToUpdate)
      this.directionToUpdate = direction;
    else
      this.directionToUpdate = undefined;
  }

  mapClick(coordinates: MapCoordinates) {
    if (this.directionToUpdate) {
      this.directionToUpdate.lat = coordinates.lat;
      this.directionToUpdate.long = coordinates.long;

      this.territory.updateDirection(this.cardId!, this.directionToUpdate)
        .subscribe(() => {
          this.territory.selectCard(this.cardId!)
        });
      this.directionToUpdate = undefined;
    }
  }

  updateUsingAddress() {
    this.geocoding.getCoordinates(this.directionToUpdate!!, this.neighborhood!!)
      .subscribe(coordinates => {
        this.mapClick(coordinates);
      });
  }

  edit() {
    this.territory.territoryCard$.pipe(take(1)).subscribe(card=> {
      sessionStorage.setItem("card", JSON.stringify(card));
      this.router.navigate(['/territory/edit']);
    });
  }
}
