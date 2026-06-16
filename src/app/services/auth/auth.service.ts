import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../notifications/notifications.service';
import { LoaderService } from '../loader/loader.service';

export interface LoginModel {
  login: string,
  password:string
}

interface TokenPayload {
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage: Storage = localStorage;
  private tokenSessionKey = "token";
  private apiHost  = environment.api;
  private _$token = new BehaviorSubject<string>(this.storage[this.tokenSessionKey] || '');
  private _$notAuthenticated = new BehaviorSubject<boolean>(false);
  public get $token() { return this._$token.asObservable(); };
  public get $notAuthenticated() { return this._$notAuthenticated.asObservable(); };
  public get $isAdmin() { return this._$token.pipe(map(() => this.isAdmin())); };
 
  constructor(
    private readonly http: HttpClient, 
    private readonly notifications: NotificationsService,
    private readonly loader: LoaderService
  ) {
    this._$token.subscribe(token => this.storage[this.tokenSessionKey] = token);
  }

  requestUserLogin() {
    this.storage.removeItem(this.tokenSessionKey);
    this._$token.next('');
    this._$notAuthenticated.next(true);
  }

  loginOnApi(login: LoginModel) {
    this.loader.show();
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
        }),
      finalize(()=> this.loader.hide()));
  }

  hasAccess(): boolean {
    return !!this._$token.getValue();
  }

  isAdmin(): boolean {
    return this.getRole().toLowerCase() == 'admin';
  }

  getRole(): string {
    const payload = this.decodeTokenPayload();
    const role = payload?.['role'];
    return typeof role == 'string' ? role : '';
  }

  private decodeTokenPayload(): TokenPayload | undefined {
    const token = this._$token.getValue();
    const payload = token.split('.')[1];

    if (!payload) {
      return undefined;
    }

    try {
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(normalizedPayload);
      return JSON.parse(decodedPayload) as TokenPayload;
    } catch {
      return undefined;
    }
  }
}
