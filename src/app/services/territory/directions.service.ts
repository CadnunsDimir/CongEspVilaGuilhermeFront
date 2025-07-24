import { Injectable } from "@angular/core";
import { Direction } from "../../models/territory-card.model";
import { Api1Service } from "../api1service";

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
        private readonly api: Api1Service) {
    }

    moveBetweenCards(payload: MoveDirections){
        return this.api.post(this.moveDireccionsApi, payload);
    }
}