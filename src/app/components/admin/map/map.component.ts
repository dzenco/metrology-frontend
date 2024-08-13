import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { tileLayer, latLng, icon, Map, Marker } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SiteService } from '../../../services/site.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  mesures: any[] = [];
  map!: Map;

  constructor(
    private siteService: SiteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.siteService.getSitesLastMesure().subscribe(mesures => {
      this.mesures = mesures;
      this.updateMarkers();
    });
  }

  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],

    zoom: 8,
    center: latLng(29.811043, 80.921603) // Ajuste le centre de la carte selon tes besoins 80.821603
  };

  private updateMarkers(): void {
    if (!this.map) return;

    this.map.eachLayer(layer => {
      if (layer instanceof Marker) {
        this.map.removeLayer(layer);
      }
    });

    const markers = this.mesures.map(mesure => {
      const temperature = mesure.site ? mesure.temperature : 'N/A';
      const pression = mesure.site ? mesure.pression : 'N/A';
      const debit= mesure.site ? mesure.debit : 'N/A';
      const lastReportedAt = mesure.site ? mesure.dateMesure : 'N/A';

      return new Marker([mesure.site.latitude, mesure.site.longitude], {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowAnchor: [4, 62],
          shadowSize: [41, 41],
          iconUrl: mesure.site.hasReported ? 'assets/img/green-icon.png' : 'assets/img/grey-icon.png'
        })
      }).bindPopup(`
        <b>${mesure.site.nameSite}</b><br>
        Latitude: ${mesure.site.latitude}<br>
        Longitude: ${mesure.site.longitude}<br>
        Température: ${temperature} °C<br>
        Pression: ${pression} Pa<br>
        Debit: ${debit} m³/s<br>
        Dernière mise à jour: ${lastReportedAt}
      `);
    });

    markers.forEach(marker => marker.addTo(this.map));
  }

  onMapReady(map: Map): void {
    this.map = map;
  }
}
