import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import L, * as Leaflet from 'leaflet';


export interface MapCoordinates {
  long: number;
  lat: number;
}
export interface MapMarker extends MapCoordinates {
  iconText: string;
  title: string;
}

enum MarkerColor{
  Blue = '#0d2fc7',
  Red = '#c70d0d'
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{

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

    if(this.userLocation)
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
  private userLocation?: MapCoordinates = {
    lat: -23.5002894,
    long: -46.5997502
  };

  constructor() {
    
  }
  ngOnInit(): void {
    var center = this.getCenter();

      var layers = [
        this.basicLayer(),
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

      navigator.geolocation.getCurrentPosition(x => {
        this.userLocation = {
          lat: x.coords.latitude || 0,
          long: x.coords.longitude || 0,
        };
  
        console.log(this.userLocation);
  
        this.layerGroup?.addLayer(this.myLocationMarker());
  
      }, error => console.error(error));
  }

  userMarks() {
    return this._markers.map(mark => this.newMarker(mark));
  }

  newMarker(marker: MapMarker, iconColor: MarkerColor = MarkerColor.Blue) {
    const style = `
      
      background: ${iconColor};
      
    `;
    const spanStyle = `
    transform: rotate(-45deg);
    display: block;
    `;
    return new Leaflet.Marker(new Leaflet.LatLng(marker.lat, marker.long), {
      icon: Leaflet.divIcon({
        // iconUrl,
        iconSize: [25, 25],
        html: `<div class="map-marker" style="${style}"><span style="${spanStyle}">${marker.iconText}</span></div>`
      }),
      title: marker.title
    } as Leaflet.MarkerOptions)
  }

  myLocationMarker(): Leaflet.Layer {
    return this.newMarker({
      lat: this.userLocation!!.lat,
      long: this.userLocation!!.long,
      title: 'Minha Localização',
      iconText: '.'
    }, MarkerColor.Red);
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
