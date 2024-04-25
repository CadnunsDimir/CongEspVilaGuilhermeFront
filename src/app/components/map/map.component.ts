import { Component, EventEmitter, Input, Output } from '@angular/core';
import L, * as Leaflet from 'leaflet';


export interface MapCoordinates {
  long: number;
  lat: number;
}
export interface MapMarker extends MapCoordinates {
  title: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

  private _markers: MapMarker[] = [];
  private layerGroup?: L.LayerGroup<any>;

  @Input()
  set markers(markers: MapMarker[]) {
    this._markers = [];
    console.log('map', this.map);

    this.layerGroup?.clearLayers();
    markers.forEach(marker => {
      this.layerGroup?.addLayer(this.newMarker(marker));
      this._markers.push(marker);
    });
    this.layerGroup?.addLayer(this.basicLayer());
    this.layerGroup?.addLayer(this.myLocationMarker());

    const { lat, long } = this.getCenter();
    this.map?.panTo({
      lat,
      lng: long
    })
  }

  @Output()
  click = new EventEmitter<MapCoordinates>();
  private map?: Leaflet.Map;
  private userLocation?: MapCoordinates;

  constructor() {
    navigator.geolocation.getCurrentPosition(x => {
      this.userLocation = {
        lat: x.coords.latitude || 0,
        long: x.coords.longitude || 0,
      };

      console.log(this.userLocation);

      var center = this.getCenter();

      var layers = [
        this.basicLayer(),
        this.myLocationMarker(),
        ...this.userMarks(),
      ];

      this.map = Leaflet.map("map", {
        center: { lat: center.lat, lng: center.long },
        zoom: 16,
      });

      this.layerGroup = L.layerGroup().addTo(this.map!!);

      layers.forEach(marks => this.layerGroup?.addLayer(marks));

      this.map.on("click", ({ latlng }) => {
        if (latlng.lat && latlng.lng) {
          this.click.emit({
            lat: latlng.lat,
            long: latlng.lng
          });
        }
      });

    }, error => console.error(error));
  }
  userMarks() {
    return this._markers.map(mark => this.newMarker(mark));
  }

  newMarker(marker: MapMarker, iconUrl: string = 'assets/blue-marker.svg') {
    return new Leaflet.Marker(new Leaflet.LatLng(marker.lat, marker.long), {
      icon: new Leaflet.Icon({
        iconSize: [50, 41],
        iconAnchor: [13, 41],
        iconUrl,
      }),
      title: marker.title
    } as Leaflet.MarkerOptions)
  }

  myLocationMarker(): Leaflet.Layer {
    return this.newMarker({
      lat: this.userLocation!!.lat,
      long: this.userLocation!!.long,
      title: 'Minha Localização'
    }, 'assets/red-marker.svg');
  }

  basicLayer = () => new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  } as Leaflet.TileLayerOptions);

  getCenter() {
    if (this._markers.length > 0) {
      var centerPositionIndex = Math.ceil(this._markers.length) - 1;
      var mark = this._markers[centerPositionIndex];

      console.log("center: ", mark);
      return mark;
    }
    return {
      lat: this.userLocation?.lat || 0,
      long: this.userLocation?.long || 0,
    }
  }
}
