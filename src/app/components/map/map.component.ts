import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import L, * as Leaflet from 'leaflet';
import { Subject } from 'rxjs';
import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter';

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
  Purple = "#8825ec",
  Orange = '#ff6d12'
}

const initMark = {
  color: MarkerColor.Red,
  iconText: '',
  title: '',
  lat: -23.5019288, 
  long: -46.597885
} ;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{
  private _markers: MapMarker[] = [];
  private layerGroup?: L.FeatureGroup<any>;
  private polygonLayer?: L.Polygon<any>;
  private tileLayers = {
    Normal : new L.TileLayer ('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }),
    Alternative : new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    })
  };

  @Input() scale = 1;
  private _polygon?: L.LatLngTuple[][];
  _staticImage: boolean = false;
  screenshoter?: SimpleMapScreenshoter;

  @Input()
  set markers(markers: MapMarker[]) {
    this._markers = [];
    this.layerGroup?.clearLayers();
    markers.forEach(marker => {
      this.layerGroup?.addLayer(this.newMarker(marker, this.drawOnCanvas(markers)));
      this._markers.push(marker);
    });

    this.fitBounds();
  }

  @Input()
  set poligon(coordinates: number[][] | undefined){
    if (coordinates) {
      this._polygon = coordinates as unknown as Leaflet.LatLngTuple[][];
    }
  }

  @Input()
  set staticImage(value: boolean){
    if (value) {
      this.fitBounds();
      this.exportStaticMap()
        .subscribe(() => this._staticImage = true);
    }else{
      this._staticImage = false;
    }    
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

      var layers = [        
        ...this.userMarks()
      ];

      if (layers.length == 0) {
        layers.push(this.newMarker(initMark,true));
      }

      this.map = Leaflet.map("map", {
        preferCanvas: true,
      });

      if (this._polygon) {
        this.polygonLayer = L.polygon(this._polygon, {color: MarkerColor.Orange}).addTo(this.map);
      }

      this.layerGroup = L.featureGroup().addTo(this.map!!);
      this.tileLayers.Normal.addTo(this.map);

      layers.forEach(marks => this.layerGroup?.addLayer(marks));     

      this.map.on("click", ({ latlng }) => {
        if (latlng.lat && latlng.lng) {
          this.click.emit({
            lat: latlng.lat,
            long: latlng.lng
          });
        }
      });

      this.screenshoter = new SimpleMapScreenshoter({
        hidden: true,        
      }).addTo(this.map);
      
      this.fitBounds();
  }

  fitBounds() {
    if (this.polygonLayer) {
      this.map?.fitBounds(this.polygonLayer.getBounds());
    } else {      
      const layersCount = this.layerGroup?.getLayers().length || 0;
      if (this.map &&  layersCount > 0) {
        const bounds = this.layerGroup?.getBounds();        
        this.map.fitBounds(bounds!);
      }
    }
  }

  drawOnCanvas(markers: MapMarker[]){
    return markers.length > 200;
  }

  userMarks() {
    return this._markers.map(mark => this.newMarker(mark, this.drawOnCanvas(this._markers)));
  }

  newMarker(marker: MapMarker, drawOnCanvas:boolean = false) {
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

  exportStaticMap() {
    const event = new Subject();
    if (this.map) {
      this.screenshoter?.takeScreen('canvas', {
        mimeType: 'image/jpeg'
      }).then((canvas: any) => {
          event.next("OK");
          var img = document.getElementById("static-map") as any;
          var dimensions = this.map?.getSize()!;
          img.width = dimensions.x;
          img.height = dimensions.y;
          img.src = canvas.toDataURL();          
      }).catch(e => {
          console.error(e)
      })
    }
    return event;
  }
  
}
