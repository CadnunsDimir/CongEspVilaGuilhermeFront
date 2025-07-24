import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { CongApiBaseService } from "./cong-api-base.service";
import { LoaderService } from "./loader/loader.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class Api2Service extends CongApiBaseService {
    constructor(
        private readonly _h: HttpClient,
        private readonly _l: LoaderService,
    ) {
        super(_h, _l);
        this.baseUrl = environment.api2;
    }

    override getToken(): Observable<string> {
        throw new Error("Method not implemented.");
    }

    override requestUserLogin(): void {
        throw new Error("Method not implemented.");
    }
}