import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth/auth.service";
import { catchError, filter, Observable, of, switchMap, take, tap } from "rxjs";
import { environment } from "../../environments/environment";

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
          catchError(error => {
            console.error(error);        
            if (error.status == 401) {
              this.auth.requestUserLogin();
            }
            if(error.status === 400) {
              return of(error);
            }
            return of('error');
          }),
          tap(console.log),
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
}