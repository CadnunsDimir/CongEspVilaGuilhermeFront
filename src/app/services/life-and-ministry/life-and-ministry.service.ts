import { Injectable } from "@angular/core";
import { CongApiBaseService } from "../cong-api-base.service";
import { LifeAndMinistryWeek } from "../../models/life-and-ministry.model";

@Injectable({
  providedIn: 'root'
})
export class LifeAndMinistryService {
    private readonly basePath = "lifeandministry/";

    constructor(
        private readonly api: CongApiBaseService
    ) {
    }

    getWeek(initialDate: string) {
        return this.api.get<LifeAndMinistryWeek>(this.basePath+initialDate, false);
    }

    updateWeek(week: LifeAndMinistryWeek) {
        return this.api.put(this.basePath, week);
    }
}