import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../notifications/notifications.service';

export interface LoginModel {
  login: string,
  password:string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage: Storage = localStorage;
  private tokenSessionKey = "token";
  private apiHost  = environment.api;
  private _$token = new BehaviorSubject<string | undefined>(this.storage[this.tokenSessionKey] || '');
  private _$notAuthenticated = new BehaviorSubject<boolean>(false);
  public get $token() { return this._$token.asObservable(); };
  public get $notAuthenticated() { return this._$notAuthenticated.asObservable(); };

 
  constructor(private http: HttpClient, private notifications: NotificationsService) {
    this._$token.subscribe(token => this.storage[this.tokenSessionKey] = token);
  }

  requestUserLogin() {
    this.storage.removeItem(this.tokenSessionKey);
    this._$notAuthenticated.next(true);
  }

  loginOnApi(login: LoginModel) {
    return this.http.post(`${this.apiHost}/api/token`, login)
      .pipe(
        tap((response: any) => {
          this.notifications.clearAll();
          this.notifications.send({message: "Bem vindo!", type: 'success'});         
          this._$token.next(response.token);
          this._$notAuthenticated.next(false);
        }),
        catchError(async response=> {
          console.log(response)
          this.notifications.send({
            type: 'error',
            message: response.error.message
          })
          return false;
        }));
  }

  hasAccess(): boolean {
    return !!this._$token.getValue();
  }
}
