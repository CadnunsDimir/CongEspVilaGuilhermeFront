import { Injectable } from "@angular/core";
import { CongApiBaseService } from "../cong-api-base.service";
import { Direction } from "../../models/territory-card.model";

export interface MoveDirections{
  originCardId: number,
  destinationCardId: number,
  directions: Direction[]
}

@Injectable({
  providedIn: 'root'
})
export class DirectionService{
    private readonly moveDireccionsApi = "territory/move";

    constructor(
        private readonly api: CongApiBaseService) {
    }

    moveBetweenCards(payload: MoveDirections){
        return this.api.post(this.moveDireccionsApi, payload);
    }
}