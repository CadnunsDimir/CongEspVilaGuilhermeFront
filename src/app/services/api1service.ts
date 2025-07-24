import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { CongApiBaseService } from "./cong-api-base.service";
import { AuthService } from "./auth/auth.service";
import { LoaderService } from "./loader/loader.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class Api1Service extends CongApiBaseService {
  constructor(
    private readonly auth: AuthService, 
    private readonly h: HttpClient,
    private readonly l: LoaderService
  ) {
    super(h,l);
    this.baseUrl = `${environment.api}/api/`;
  }

  override getToken(): Observable<string> {
    return this.auth.$token;
  }

  override requestUserLogin(): void {
    return this.auth.requestUserLogin();
  }
}