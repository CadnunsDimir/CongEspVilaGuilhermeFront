import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, filter, interval, map, Observable, of, tap } from 'rxjs';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { NotificationsService } from '../notifications/notifications.service';
import { FullMapService } from '../full-map/full-map.service';
import { Api1Service } from '../api1service';

@Injectable({
  providedIn: 'root'
})
export class TerritoryService{
  private basePath = `territory/`;
  private cardsSessionKey = "cards";
  private tableName = 'CardTable';
  private _cards$ = new BehaviorSubject<number[] | undefined>(JSON.parse(localStorage.getItem(this.cardsSessionKey) || '[]') ?? undefined);
  private _territoryCard$ = new BehaviorSubject<TerritoryCard | undefined>((() => {
    const cardId = localStorage["lastCardSelected"] ?? -1;
    const dbTable = JSON.parse(localStorage[this.tableName] || "{}");
    return dbTable[cardId];
  })());

  private readonly _territoryCardEditing$ = new BehaviorSubject<TerritoryCard | undefined>(undefined);
  public territoryCardEditing$ = this._territoryCardEditing$.asObservable();

  // check data every 10 secs and save on Db
  private updateInterval = interval(30000).pipe(
    tap(() => console.log('needUpdateOnDb: ', this.needUpdateOnDb)),
    filter(()=> !!this._cards$.getValue() && this.needUpdateOnDb),
    map(()=> this._territoryCard$.getValue() as TerritoryCard)
  ).subscribe(card=> {
    this.updateCardOnDb(card)
      .subscribe(()=> this.notifyCardUpdateOK(card.cardId!));
    this.fullMap.clear();
    this.needUpdateOnDb = false;
    this.notify.send({
      type: 'info',
      message: `atualizando cartão ${card.cardId}...`
    });
  });

  needUpdateOnDb = false;

  constructor(
    private readonly api: Api1Service,
    private readonly fullMap: FullMapService,
    private readonly notify: NotificationsService) {
  }  

  get cards$() {
    const cards = this._cards$.getValue();
    if (cards == undefined || cards.length == 0) {
      this.api.get(this.basePath, true)
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

  newCardId(): number | undefined {
    const cards = [...(this._cards$.value ?? [])];
    return cards[cards.length - 1] +1;
  }

  resetSelectedCard() {
    sessionStorage.removeItem("card");
  }

  setCardToEdition(){
    const card = this._territoryCard$.value;
    this._territoryCardEditing$.next(card);
  }

  selectCard(cardId: number) {
    var previousLoadedCard = this._territoryCard$.getValue()!;
    var $request = this.api.get<TerritoryCard>(`${this.basePath}${cardId}`, true)
                    .pipe(
                      tap((card) => {
                        this.saveOnLocalStorage(card);                        
                        this._territoryCard$.next(card);
                      }));
    if(this.needUpdateOnDb && previousLoadedCard){
      this.updateCardOnDb(previousLoadedCard).subscribe(() => {
        this.notifyCardUpdateOK(previousLoadedCard.cardId!); 
        $request.subscribe();
      });
    }else{
      $request.subscribe() 
    }
    this.needUpdateOnDb = false;
    return this._territoryCard$.pipe(delay(500));   
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
    return this.api.put(this.basePath, card, true);
  }

  notifyCardUpdateOK(cardId: number): void {
    this.notify.send({
      type: 'success',
      message: `cartão ${cardId} salvo`
    });
  }

  private checkCardData(card: TerritoryCard) {
    card.neighborhood = card.neighborhood.trim();
    card.directions.forEach(d=> {
      d.streetName = d.streetName.trim();
      d.houseNumber = d.houseNumber.trim();
      d.complementaryInfo = d.complementaryInfo.trim();
    });
  }

  createCard(card: TerritoryCard) {
    this.checkCardData(card);
    return this.api.post<TerritoryCard>(this.basePath, card).pipe(
      tap(() => {
        const cards = [...(this._cards$.value as any), card.cardId];
        this._cards$.next(cards);
        localStorage.setItem(this.cardsSessionKey, JSON.stringify(cards));
        this.selectCard(card.cardId!);
        this.notifyCardUpdateOK(card.cardId!);
      }),
    );
  }

  updateCard(card: TerritoryCard){
    this.checkCardData(card);
    this.needUpdateOnDb = true;
    this.saveOnLocalStorage(card);
    this._territoryCard$.next(card);
  }

  saveOnLocalStorage(card: TerritoryCard) {    
    const dbTable = JSON.parse(localStorage[this.tableName] ?? "{}");
    dbTable[card.cardId!] = card;
    localStorage.setItem(this.tableName, JSON.stringify(dbTable));
    localStorage.setItem("lastCardSelected", card.cardId!.toString());
  }

  getShareableCardId(cardId: number) {
    return this.api.get<any>(`${this.basePath}${cardId}/share`, true)
      .pipe(map(x=> x.temporaryId));
  }

  getCardPublicEndPoint(temporaryId: string){
    console.log(`${this.basePath}${temporaryId}/public`);
    this.api.get<TerritoryCard>(`${this.basePath}${temporaryId}/public`).subscribe(card=> {
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

  deleteCard(cardId: number | undefined) : Observable<boolean> {
    return this.api.delete(`${this.basePath}${cardId}`)
      .pipe(
        map(response => response.status !== 422),
        tap(data=> {
          console.log("territoryService.deleteCard", data);
          this.fullMap.clear();
          this._cards$.next([]);
        }),
        catchError(()=> of(false)));        
  }
}
