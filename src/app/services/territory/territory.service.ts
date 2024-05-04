import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, interval, map, of, switchMap, take, tap } from 'rxjs';
import { Direction, TerritoryCard } from '../../models/territory-card.model';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class TerritoryService {
  
  
  private baseUrl = `${environment.api}/api/territory/`;
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
    private auth: AuthService, 
    private http: HttpClient, 
    private notify: NotificationsService) {
  }

  private requestWithToken<T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body: any = null) {
    return this.auth.$token.pipe(
      take(1),
      switchMap(token => this.http.request<T>(method, url, {
        body,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })),
      take(1),
      catchError(error => {
        console.error(error);        
        if (error.status == 401) {
          this.auth.requestUserLogin();
        }
        return of('error');
      }),
      tap(console.log),
      filter(x=> x != 'error')
    );
  }

  get cards$() {
    const cards = this._cards$.getValue();
    if ( cards == undefined || cards.length == 0) {
      this.requestWithToken(this.baseUrl)
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
    var $request = this.requestWithToken<TerritoryCard>(`${this.baseUrl}${cardId}`)
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
    const url = `${this.baseUrl}${cardId}/direction`;
    return this.requestWithToken(url, 'PUT', direction);
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
    return this.requestWithToken(this.baseUrl, 'PUT', card);
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
    return this.requestWithToken(`${this.baseUrl}${cardId}/share`)
      .pipe(map(x=> x.temporaryId));
  }

  getCardPublicEndPoint(temporaryId: string){
    console.log(`${this.baseUrl}${temporaryId}/public`);
    this.http.get<TerritoryCard>(`${this.baseUrl}${temporaryId}/public`).subscribe(card=> {
      this.saveOnLocalStorage(card);                        
      this._territoryCard$.next(card);
    });
  }

  clear() {
    sessionStorage.removeItem(this.cardsSessionKey);
  }
}
