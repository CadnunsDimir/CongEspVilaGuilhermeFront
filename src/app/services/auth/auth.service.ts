import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginModel {
  login: string,
  password:string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage: Storage = localStorage;
  private _$token = new BehaviorSubject<string | undefined>(this.storage['token'] || '');
  private _$notAuthenticated = new BehaviorSubject<boolean>(false);
  public get $token() { return this._$token.asObservable(); };
  public get $notAuthenticated() { return this._$notAuthenticated.asObservable(); };
 
  constructor(private http: HttpClient) {
    this._$token.subscribe(token => this.storage["token"] = token);
  }

  requestUserLogin() {
    this._$notAuthenticated.next(true);
  }

  loginOnApi(login: LoginModel) {
    return this.http.post("http://localhost:5264/api/token", login)
      .pipe(
        tap((response: any) => {
         
          this._$token.next(response.token);
          this._$notAuthenticated.next(false);
        }));
  }

  hasAccess(): boolean {
    return !!this._$token.getValue();
  }
}
