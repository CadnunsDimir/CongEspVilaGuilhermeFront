import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth/auth.service";
import { catchError, filter, Observable, of, switchMap, take, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { StatusCode } from "../models/api.enum";

export class BaseService {
    private baseUrl = `${environment.api}/api/`;
    constructor(
        private auth: AuthService, 
        private http: HttpClient) {}

    private requestWithToken<T>(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body: any = null) : Observable<T>{
        const url = `${this.baseUrl}${path}`;

        return this.auth.$token.pipe(
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
              this.auth.requestUserLogin();
            }

            if(entityErrors.includes(httpRequestError.error.status)) {
              return of(httpRequestError.error);
            }
            return of('error');
          }),
          filter(x=> x != 'error')
        );
      }

    get<T = any>(path: string, tokenRequired: boolean = false){
        if (!tokenRequired) {
            return this.http.get<T>(`${this.baseUrl}${path}`);   
        }
        return this.requestWithToken<T>(path);        
    }

    put<T = any>(path: string, body: any) { return this.requestWithToken<T>(path, 'PUT', body); }
    post<T = any>(path: string, body: any) { return this.requestWithToken<T>(path, 'POST', body); }
    delete<T = any>(path: string, body: any = null) { return this.requestWithToken<T>(path, 'DELETE', body); }
}