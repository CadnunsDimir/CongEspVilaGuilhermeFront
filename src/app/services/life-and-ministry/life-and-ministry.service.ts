import { Injectable } from "@angular/core";
import { BaseService } from "../base.service";
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { LifeAndMinistryWeek } from "../../models/life-and-ministry.model";

@Injectable({
  providedIn: 'root'
})
export class LifeAndMinistryService extends BaseService {
    private readonly basePath = "lifeandministry/";

    constructor(
        private readonly _auth: AuthService, 
        private readonly _http: HttpClient) {
          super(_auth, _http)
    }

    getWeek(initialDate: string) {
        return this.get<LifeAndMinistryWeek>(this.basePath+initialDate, false);
    }

    updateWeek(week: LifeAndMinistryWeek) {
        return this.put(this.basePath, week);
    }
}