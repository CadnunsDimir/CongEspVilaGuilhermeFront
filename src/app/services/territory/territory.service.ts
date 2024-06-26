import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, of, switchMap, take, tap } from 'rxjs';
import { Direction, TerritoryCard } from '../../models/territory-card.model';

@Injectable({
  providedIn: 'root'
})
export class TerritoryService {

  private baseUrl = 'http://localhost:5264/api/territory/';
  
  private _cards$ = new BehaviorSubject<number[] | undefined>(undefined);
  private _territoryCard$ = new BehaviorSubject<TerritoryCard | undefined>(undefined);

  constructor(private auth: AuthService, private http: HttpClient) { }

  private requestWithToken<T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body: any = null) {
    return this.auth.$token.pipe(
      take(1),
      tap(x => console.log(x)),
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
    if (this._cards$.getValue() == undefined) {
      this.requestWithToken(this.baseUrl)
        .subscribe((list) => this._cards$.next(list as number[]));
    }
    return this._cards$.asObservable();
  }

  get territoryCard$() {
    return this._territoryCard$.asObservable();
  }

  selectCard(cardId: number) {
    this.requestWithToken<TerritoryCard>(`${this.baseUrl}${cardId}`)
      .subscribe((card) => this._territoryCard$.next(card))
  }

  updateDirection(cardId: number, direction: Direction) {
    const url = `${this.baseUrl}${cardId}/direction`;
    return this.requestWithToken(url, 'PUT', direction);
  }

  updateCard(card: TerritoryCard){
    return this.requestWithToken(this.baseUrl, 'PUT', card);
  }
}
