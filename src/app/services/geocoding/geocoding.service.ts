import { Injectable } from '@angular/core';
import { Direction } from '../../models/territory-card.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private url = "http://nominatim.openstreetmap.org/search";

  constructor(private http: HttpClient) {

  }

  getCoordinates(direction: Direction, neighborhood: string) {
    const params = {
      q: `${direction.houseNumber} ${direction.streetName}, ${neighborhood}`,
      format: 'json'
    };

    return this.http.get(this.url, { params }).pipe(
      map((x:any) => {
        const { lat, lon, display_name } = x[0];
        return { lat, long: lon, full_adress: display_name };
      }));
  }

}
