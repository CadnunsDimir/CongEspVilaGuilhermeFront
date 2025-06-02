import { Injectable } from "@angular/core";
import { BaseService } from "../base.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { Direction } from "../../models/territory-card.model";
import { LoaderService } from "../loader/loader.service";

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
        readonly _auth: AuthService, 
        readonly _http: HttpClient,
        readonly _loader: LoaderService) {
          super(_auth, _http, _loader)
    }

    moveBetweenCards(payload: MoveDirections){
        return this.post(this.moveDireccionsApi, payload);
    }
}