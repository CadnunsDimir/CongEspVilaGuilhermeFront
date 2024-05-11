import { Injectable } from '@angular/core';
import { Direction } from '../../models/territory-card.model';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, filter, map, tap} from 'rxjs';
import { NotificationsService } from '../notifications/notifications.service';

export interface GeoCode{ lat: number, long: number , full_adress: string }

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private url = "http://nominatim.openstreetmap.org/search";

  constructor(private http: HttpClient, private notify: NotificationsService) {

  }

  getCoordinates(direction: Direction, neighborhood: string): Observable<GeoCode> {
    const params = {
      q: `${direction.houseNumber} ${direction.streetName}, São Paulo`,
      format: 'json'
    };

    return this.http.get(this.url, { params }).pipe(
      map((x: any)=>  x.filter((entry:any)=> entry.display_name.includes(neighborhood) || entry.display_name.includes('São Paulo'))),
      tap((x: any) => {
        if (x.length == 0) {
          throw new Error("Nenhum resultado encontrado: verifique o nome da rua ou do bairro");
        }
      }),
      map((x: any) => {
        const { lat, lon, display_name } = x[0];
        return { lat, long: lon, full_adress: display_name };
      }),
      catchError(async response=> {
        this.notify.send({
          message: response.message,
         type: 'error' 
        });
        return false;
      }),
      filter(x=> !!x)
    ) as Observable<GeoCode>;
  }

}
