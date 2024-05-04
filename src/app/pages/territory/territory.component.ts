import { Component, OnInit } from '@angular/core';
import { TerritoryService } from '../../services/territory/territory.service';
import { Observable, take, tap } from 'rxjs';
import { MapCoordinates, MapMarker, MarkerColor } from '../../components/map/map.component';
import { marker } from 'leaflet';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { GeocodingService } from '../../services/geocoding/geocoding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications/notifications.service';

interface DirectionMapMarker extends MapMarker{
  directionIndex: number
}

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
  markers: DirectionMapMarker[] = [];
  directionToUpdate?: Direction;
  cards$?: Observable<number[] | undefined>;
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
          directionIndex: x.index,
          lat: x.lat!!,
          long: x.long!!,
          title: `${x.index} - ${x.streetName}, ${x.houseNumber}`,
          iconText: x.index.toString(),
          color: this.colorByIndex(x.index)
        })) || [];
      this.markers = markers;
    })
  );
  sharedCardId?: string;
  disableEdit: boolean = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private territory: TerritoryService,
    private geocoding: GeocodingService,
    private notify: NotificationsService
  ) { }

  ngOnInit() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.sharedCardId = params['sharedCardId'];

      if (this.sharedCardId) {
        this.disableEdit = true;
        this.territory.getCardPublicEndPoint(this.sharedCardId);
      }else{
        this.cards$ = this.territory.cards$;
      }
    });
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

  share() {
    if (this.sharedCardId) {
      this.shareContent(this.sharedCardId);
    } else {
      this.territory.getShareableCardId(this.cardId!).subscribe(x=> {
        this.sharedCardId = x;
        this.shareContent(x);
      });
    }    
  }
  shareContent(id: any) {
    const url = `${window.location.href}/public/${id}`;
    console.log("sharing url", url);
    navigator.share({
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

  getMarkColor(directionIndex: number): MarkerColor {
    var mark = this.markers.filter(x => x.directionIndex == directionIndex + 1)[0];
    return mark?.color || '#ccc'
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
