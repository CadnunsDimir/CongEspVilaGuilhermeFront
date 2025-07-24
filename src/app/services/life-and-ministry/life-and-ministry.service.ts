import { Injectable } from "@angular/core";
import { LifeAndMinistryWeek } from "../../models/life-and-ministry.model";
import { Api1Service } from "../api1service";

@Injectable({
  providedIn: 'root'
})
export class LifeAndMinistryService {
    private readonly basePath = "lifeandministry/";

    constructor(
        private readonly api: Api1Service
    ) {
    }

    getWeek(initialDate: string) {
        return this.api.get<LifeAndMinistryWeek>(this.basePath+initialDate, false);
    }

    updateWeek(week: LifeAndMinistryWeek) {
        return this.api.put(this.basePath, week);
    }
}