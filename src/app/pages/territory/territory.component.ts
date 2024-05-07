import { Component, OnInit } from '@angular/core';
import { TerritoryService } from '../../services/territory/territory.service';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { MapCoordinates, MapMarker, MarkerColor } from '../../components/map/map.component';
import { marker } from 'leaflet';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { GeocodingService } from '../../services/geocoding/geocoding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { ShareService } from '../../share/share.service';

interface DirectionMapMarker extends MapMarker {
  directionIndex: number
}

@Component({
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styleUrl: './territory.component.scss'
})
export class TerritoryComponent implements OnInit {
    
  markersColors = this.randomColors();
  printAsCard = false;
  showCardList = false;
  directionToUpdate?: Direction;
  cards$?: Observable<number[] | undefined>;
  territoryCard$ = this.territory.territoryCard$.pipe(
    map(x => this.mapCardWithMarks(x)));
  cardId$ = this.territoryCard$.pipe(map(x => x.cardId));
  neighborhood$ = this.territoryCard$.pipe(map(x => x.neighborhood));
  sharedCardId?: string;
  disableEdit: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private territory: TerritoryService,
    private geocoding: GeocodingService,
    private notify: NotificationsService,
    private shareService: ShareService
  ) { }

  ngOnInit() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.sharedCardId = params['sharedCardId'];
      if (this.sharedCardId) {
        this.disableEdit = true;
        this.territory.getCardPublicEndPoint(this.sharedCardId);
      } else {
        this.cards$ = this.territory.cards$;
      }
    });
  }

  randomColors() {
    return [
      MarkerColor.Blue,
      MarkerColor.Green,
      MarkerColor.Green,
      MarkerColor.Red,
      MarkerColor.Purple
    ].sort(() => Math.random() - 0.5)
  }

  mapCardWithMarks(x: TerritoryCard | undefined) {
    const directions = x?.directions
      .map((x, i) => ({
        index: i + 1,
        color: this.colorByCoordinates(i + 1, x),
        ...x
      })) || [];

    return {
      neighborhood: x?.neighborhood,
      cardId: x?.cardId,
      directions: directions,
      markers: directions
        .filter(x => x.lat && x.long)
        .map(x => ({
          directionIndex: x.index,
          lat: x.lat!!,
          long: x.long!!,
          title: `${x.index} - ${x.streetName}, ${x.houseNumber}`,
          iconText: x.index.toString(),
          color: x.color
        })) || []
    }
  }

  selectCard(cardId: number) {
    this.showCardList = false;
    this.territory.selectCard(cardId);
  }

  selectDirection(direction: Direction) {
    if (!this.disableEdit && direction != this.directionToUpdate) {
      this.directionToUpdate = direction;
      this.notify.send({
        message: "Seleccione un local en el mapa para actualizar la posicion del marcador ou clique novamente en la direccion para cancelar",
        type: 'warning',
        timeout: 10000
      });
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
    this.neighborhood$
      .pipe(
        switchMap(neighborhood => this.geocoding.getCoordinates(this.directionToUpdate!!, neighborhood!)))
      .subscribe(coordinates => {
        this.updateCoordinates(coordinates);
      });
  }

  share() {
    this.cardId$.pipe(take(1)).subscribe(cardId => {
      if (this.sharedCardId) {
        this.shareContent(cardId!, this.sharedCardId);
      } else {
        this.territory.getShareableCardId(cardId!).subscribe(publicCardId => {
          this.sharedCardId = publicCardId;
          this.shareContent(cardId!, publicCardId);
        });
      }
    });
  }

  shareContent(cardId: number, publicId: any) {
    const url = `${window.location.href}/public/${publicId}`;
    console.log("sharing url", url);
    this.shareService.shareLink({
      title: `Cartão nº ${cardId}`,
      url
    });
  }

  showCardListClick() {
    if (!this.disableEdit) {
      this.showCardList = !this.showCardList;
    }
  }

  edit() {
    if (!this.disableEdit) {
      this.territory.territoryCard$.pipe(take(1)).subscribe(card => {
        sessionStorage.setItem("card", JSON.stringify(card));
        this.router.navigate(['/territory/edit']);
      });
    }
  }

  colorByCoordinates(index: number, direction: Direction): MarkerColor {
    if (!direction.lat) {
      return MarkerColor.Grey;
    }
    const colorIndex = this.markersColors.length + index - 1;
    return this.markersColors[colorIndex % this.markersColors.length];
  }
}
