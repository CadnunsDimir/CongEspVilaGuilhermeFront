import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, interval, map, of, switchMap, take, tap } from 'rxjs';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../notifications/notifications.service';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class TerritoryService extends BaseService{
  private basePath = `territory/`;
  private cardsSessionKey = "cards";
  private tableName = 'CardTable';
  private _cards$ = new BehaviorSubject<number[] | undefined>(JSON.parse(localStorage.getItem(this.cardsSessionKey) || '[]') || undefined);
  private _territoryCard$ = new BehaviorSubject<TerritoryCard | undefined>((() => {
    const cardId = localStorage["lastCardSelected"] || -1;
    const dbTable = JSON.parse(localStorage[this.tableName] || "{}");
    return dbTable[cardId];
  })());

  // check data every 10 secs and save on Db
  private updateInterval = interval(30000).pipe(
    tap(() => console.log('needUpdateOnDb: ', this.needUpdateOnDb)),
    filter(()=> !!this._cards$.getValue() && this.needUpdateOnDb),
    map(()=> this._territoryCard$.getValue() as TerritoryCard)
  ).subscribe(card=> {
    this.updateCardOnDb(card)
      .subscribe(()=> this.notifyCardUpdateOK(card.cardId));
    this.needUpdateOnDb = false;
    this.notify.send({
      type: 'info',
      message: `atualizando cartão ${card.cardId}...`
    });
  });

  needUpdateOnDb = false;

  constructor(
    auth: AuthService, 
    http: HttpClient, 
    private notify: NotificationsService) {
      super(auth, http)
  }

  

  get cards$() {
    const cards = this._cards$.getValue();
    if ( cards == undefined || cards.length == 0) {
      this.get(this.basePath, true)
        .subscribe((list) => {
          localStorage.setItem(this.cardsSessionKey, JSON.stringify(list))
          this._cards$.next(list as number[]);
        });
    }
    return this._cards$.asObservable();
  }

  get territoryCard$() {
    return this._territoryCard$.asObservable();
  }

  selectCard(cardId: number) {
    var previousLoadedCard = this._territoryCard$.getValue()!;
    var $request = this.get<TerritoryCard>(`${this.basePath}${cardId}`, true)
                    .pipe(
                      tap((card) => {
                        this.saveOnLocalStorage(card);                        
                        this._territoryCard$.next(card);
                      }));
    if(this.needUpdateOnDb && previousLoadedCard){
      this.updateCardOnDb(previousLoadedCard).subscribe(() => {
        this.notifyCardUpdateOK(previousLoadedCard.cardId); 
        $request.subscribe();
      });
    }else{
      $request.subscribe() 
    }
    this.needUpdateOnDb = false;    
  }

  updateDirection(cardId: number, direction: Direction) {
    const url = `${this.basePath}${cardId}/direction`;
    return this.put(url, direction);
  }

  updateCoordinatesOnCardInMemory(direction: Direction) {
    var card = this._territoryCard$.getValue()!;
    card.directions
      .filter(x=>
        x.houseNumber == direction.houseNumber && 
        x.streetName == direction.streetName && 
        x.complementaryInfo == direction.complementaryInfo)
      .forEach(x=> {
        x.lat = direction.lat;
        x.long = direction.long;
      });
    this.updateCard(card);
  }

  private updateCardOnDb(card: TerritoryCard){
    return this.put(this.basePath, card);
  }

  notifyCardUpdateOK(cardId: number): void {
    this.notify.send({
      type: 'success',
      message: `cartão ${cardId} salvo`
    });
  }

  updateCard(card: TerritoryCard){
    this.needUpdateOnDb = true;
    this.saveOnLocalStorage(card);
    this._territoryCard$.next(card);
  }

  saveOnLocalStorage(card: TerritoryCard) {    
    const dbTable = JSON.parse(localStorage[this.tableName] || "{}");
    dbTable[card.cardId] = card;
    localStorage.setItem(this.tableName, JSON.stringify(dbTable));
    localStorage.setItem("lastCardSelected", card.cardId.toString());
  }

  getShareableCardId(cardId: number) {
    return this.get(`${this.basePath}${cardId}/share`, true)
      .pipe(map(x=> x.temporaryId));
  }

  getCardPublicEndPoint(temporaryId: string){
    console.log(`${this.basePath}${temporaryId}/public`);
    this.get<TerritoryCard>(`${this.basePath}${temporaryId}/public`).subscribe(card=> {
      this.saveOnLocalStorage(card);                        
      this._territoryCard$.next(card);
    });
  }

  clear() {
    localStorage.removeItem(this.cardsSessionKey);
    localStorage.removeItem(this.tableName);
  }

  lastCardId() {
    const cards = this._cards$.getValue() || [];
    return cards[cards.length-1];
  }
}
