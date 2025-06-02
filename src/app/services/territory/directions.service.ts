import { Injectable } from "@angular/core";
import { BaseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { Direction } from "../../models/territory-card.model";

export interface MoveDirections{
  originCardId: number,
  destinationCardId: number,
  directions: Direction[]
}

@Injectable({
  providedIn: 'root'
})
export class DirectionService extends BaseService{
    private readonly moveDireccionsApi = "territory/move";
    
    constructor(
        private readonly _auth: AuthService, 
        private readonly _http: HttpClient) {
          super(_auth, _http)
    }

    moveBetweenCards(payload: MoveDirections){
        return this.post(this.moveDireccionsApi, payload);
    }
}