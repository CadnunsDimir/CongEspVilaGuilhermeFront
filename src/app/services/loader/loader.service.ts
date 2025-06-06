import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService{
    _loader$ = new BehaviorSubject<boolean>(false);
    loader$ = this._loader$.asObservable();

    show() {
        this._loader$.next(true);
    }

    hide() {
        this._loader$.next(false);
    }
}