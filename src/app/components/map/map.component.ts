import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import L, * as Leaflet from 'leaflet';


export interface MapCoordinates {
  long: number;
  lat: number;
}
export interface MapMarker extends MapCoordinates {
  iconText: string;
  title: string;
  color: MarkerColor
}

export enum MarkerColor{
  Blue = '#0d2fc7',
  Red = '#c70d0d',
  Green ='green',
  Yellow = 'yellow',
  Grey = "#ccc",
  Purple = "#8825ec"
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{

  private _markers: MapMarker[] = [];
  private layerGroup?: L.LayerGroup<any>;

  @Input() scale = 1;

  @Input()
  set markers(markers: MapMarker[]) {
    this._markers = [];
    this.layerGroup?.clearLayers();
    markers.forEach(marker => {
      this.layerGroup?.addLayer(this.newMarker(marker, this.drawOnCanvas(markers)));
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
        preferCanvas: true,
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

  drawOnCanvas(markers: MapMarker[]){
    return markers.length > 200;
  }

  userMarks() {
    return this._markers.map(mark => this.newMarker(mark, this.drawOnCanvas(this._markers)));
  }

  newMarker(marker: MapMarker, drawOnCanvas:boolean = false) {
    console.log('drawOnCanvas',drawOnCanvas)
    if (drawOnCanvas) {
      return Leaflet.circleMarker(new Leaflet.LatLng(marker.lat, marker.long), {
        radius: 8 * this.scale,
        color: marker.color,
        opacity: 1,
        fillOpacity:0.8,
      }).bindTooltip(L.tooltip({
        content: `${marker.iconText}:${marker.title}`,
      }));
    }else{
      const style = `
      
        background: ${marker.color};
        transform: rotate(45deg) scale(${this.scale});
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
  }

  myLocationMarker(): Leaflet.Layer {
    return this.newMarker({
      lat: this.userLocation!!.lat,
      long: this.userLocation!!.long,
      title: 'Minha Localização',
      iconText: '.',
      color: MarkerColor.Red
    });
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
