import { Component, EventEmitter, Output } from '@angular/core';
import * as Leaflet from 'leaflet';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

  userLocation?: { latitude: number, longitude: number };

  @Output()
  click = new EventEmitter<{ lat: number, long: number }>();
  map?: Leaflet.Map;

  constructor() {
    navigator.geolocation.getCurrentPosition(x => {
      this.userLocation = {
        latitude: x.coords.latitude || 0,
        longitude: x.coords.longitude || 0,
      };

      console.log(this.userLocation);

      this.map = Leaflet.map("map", {
        center: { lat: this.userLocation.latitude, lng: this.userLocation.longitude },
        zoom: 12,
        layers: [
          this.basicLayer(),
          this.centerMark()
        ]
      });

      this.map.on("click", ({ latlng }) => this.click.emit({
        lat: latlng.lat,
        long: latlng.lng
      }));

    }, error => console.error(error));
  }

  centerMark(): Leaflet.Layer {
    return new Leaflet.Marker(new Leaflet.LatLng(this.userLocation!!.latitude, this.userLocation!!.longitude), {
      icon: new Leaflet.Icon({
        iconSize: [50, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/red-marker.svg',
      }),
      title: 'My Location'
    } as Leaflet.MarkerOptions)
  }

  basicLayer = () => new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  } as Leaflet.TileLayerOptions);

}
