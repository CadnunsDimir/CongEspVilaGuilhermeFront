import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth/auth.service";
import { catchError, filter, finalize, Observable, of, switchMap, take } from "rxjs";
import { environment } from "../../environments/environment";
import { StatusCode } from "../models/api.enum";
import { LoaderService } from "./loader/loader.service";
import { Injectable } from "@angular/core";

export type HttpVerb =  'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export abstract class CongApiBaseService {
    private _baseUrl = `${environment.api}/api/`;

    set baseUrl(url: string){
      this._baseUrl = url;
    }

    constructor(
        private readonly http: HttpClient,
        private readonly loaderService: LoaderService
      ) {}

    abstract getToken(): Observable<string>;
    abstract requestUserLogin(): void;

    private requestWithToken<T>(path: string, method: HttpVerb = 'GET', body: any = null) : Observable<T>{
        const url = `${this._baseUrl}${path}`;

        this.loaderService.show();

        return this.getToken().pipe(
          take(1),
          switchMap(token => this.http.request<T>(method, url, {
            body,
            headers: {
              Authorization: `Bearer ${token}`
            }
          })),
          take(1),
          catchError(httpRequestError => {
            const entityErrors = [StatusCode.BadRequest, StatusCode.UnprocessedEntity];
            if (httpRequestError.status == StatusCode.Unauthorized) {
              this.requestUserLogin();
            }

            if(entityErrors.includes(httpRequestError.error.status)) {
              return of(httpRequestError.error);
            }
            return of('error');
          }),
          filter(x=> x != 'error'),
          finalize(()=> this.loaderService.hide())
        );
      }

    private request<T = any>(path: string, method: HttpVerb = 'GET', body: any = {}, tokenRequired: boolean = false)  : Observable<T>{
        this.loaderService.show();
        const url = `${this._baseUrl}${path}`;

        if (!tokenRequired) {
            return this.http.request<T>(method, url, {
              body
            }).pipe(
                finalize(()=> this.loaderService.hide()));
        }
        return this.requestWithToken<T>(path);        
    }

    get<T = any>(path: string, tokenRequired: boolean = false) { return this.request<T>(path, 'GET', null, tokenRequired) }
    put<T = any>(path: string, body: any, tokenRequired: boolean = false) { return this.request<T>(path, 'PUT', body, tokenRequired); }
    patch<T = any>(path: string, body: any, tokenRequired: boolean = false) { return this.request<T>(path, 'PATCH', body, tokenRequired); }
    post<T = any>(path: string, body: any, tokenRequired: boolean = true) { return this.request<T>(path, 'POST', body, tokenRequired); }
    delete<T = any>(path: string, body: any = null) { return this.requestWithToken<T>(path, 'DELETE', body); }
}