import { Component, OnInit } from '@angular/core';
import { TerritoryService } from '../../services/territory/territory.service';
import { Observable, delay, filter, map, switchMap, take, tap } from 'rxjs';
import { MapCoordinates, MapMarker, MarkerColor } from '../../components/map/map.component';
import { marker } from 'leaflet';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { GeocodingService } from '../../services/geocoding/geocoding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { ShareService, ShareServiceOptions } from '../../services/share/share.service';
import { faCalendar, faEyeSlash, faPen, faPlus, faPrint, faShare } from '@fortawesome/free-solid-svg-icons';
import { TerritoryAssignmentRecordFormService } from '../../services/territory/territory-assignment-record-form.service';

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
    tap(x=> this.showCardList = !x),
    map(x => this.mapCardWithMarks(x)));
  cardId$ = this.territoryCard$.pipe(map(x => x.cardId));
  neighborhood$ = this.territoryCard$.pipe(map(x => x.neighborhood));
  sharedCardId?: string;
  disableEdit: boolean = false;
  showShareOptions = false;
  shareSelector = '#share-area';
  faEditIcon = faPen;
  faShareIcon = faShare;
  faPrintIcon = faPrint;
  faPrintSlashIcon = faEyeSlash;
  faNewCard = faPlus;
  faAssignmentRecord = faCalendar;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private territory: TerritoryService,
    private geocoding: GeocodingService,
    private notify: NotificationsService,
    private shareService: ShareService,
    private assignmentRecordForm: TerritoryAssignmentRecordFormService
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
      if (!direction.lat) {
        this.updateUsingAddress();
      }
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
          take(1),
          filter(neighborhood => !!neighborhood && !!this.directionToUpdate),
          map(neighborhood=> [neighborhood, this.directionToUpdate as any]),
          switchMap(([neighborhood, direction]) => this.geocoding.getCoordinates(direction, neighborhood)))
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

  generate(action: ShareServiceOptions){
    this.printAsCard = true;
    this.showShareOptions = false;
    this.cardId$.pipe(
      take(1),
      delay(1000),
      switchMap(cardId=> this.shareService.save(action,this.shareSelector, `tarjeta_${cardId}`)))
    .subscribe(() => this.printAsCard = false);
  }

  generatePdf() {
    this.generate('pdf');
  }

  generateImage() {
    this.generate('img');
  }

  showCardListClick() {
    if (!this.disableEdit) {
      this.showCardList = !this.showCardList;
    }
  }
  
  createNewCard() {
    if(!this.disableEdit){
      this.territory.resetSelectedCard();
      this.router.navigate(['/territory/edit']);
    }
  }  

  edit() {
    if (!this.disableEdit) {
      this.territory.setCardToEdition();
      this.router.navigate(['/territory/edit']);
    }
  }

  colorByCoordinates(index: number, direction: Direction): MarkerColor {
    if (!direction.lat) {
      return MarkerColor.Grey;
    }
    const colorIndex = this.markersColors.length + index - 1;
    return this.markersColors[colorIndex % this.markersColors.length];
  }

  addAssignmentRecord() {
    this.cardId$.pipe(take(1)).subscribe(territoryNumber=>
      this.assignmentRecordForm
        .openFormWithTerritoryNumber(territoryNumber as number));
  }
}
