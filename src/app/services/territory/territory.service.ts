import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of, switchMap, take, tap } from 'rxjs';
import { TerritoryCard } from '../../models/territory-card.model';

@Injectable({
  providedIn: 'root'
})
export class TerritoryService {
  private _cards$ = new BehaviorSubject<number[] | undefined>(undefined);
  private _territoryCard$ = new BehaviorSubject<TerritoryCard | undefined>(undefined);

  constructor(private auth: AuthService, private http: HttpClient) { }

  private requestWithToken<T>(url: string) {
    return this.auth.$token.pipe(
      take(1),
      tap(x => console.log(x)),
      switchMap(token => this.http.get<T>(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })),
      catchError(error => {
        console.error(error);
        this.auth.requestUserLogin();
        return of(undefined);
      })
    );
  }

  get cards$() {
    if (this._cards$.getValue() == undefined) {
      this.requestWithToken('http://localhost:5264/api/territory')
        .subscribe((list) => this._cards$.next(list as number[]));
    }
    return this._cards$.asObservable();
  }

  get territoryCard$() {
    return this._territoryCard$.asObservable();
  }

  selectCard(cardId: number) {
    this.requestWithToken<TerritoryCard>(`http://localhost:5264/api/territory/${cardId}`)
      .subscribe((card) => this._territoryCard$.next(card))
  }
}
