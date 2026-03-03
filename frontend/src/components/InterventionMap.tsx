'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface InterventionMapProps {
  zone: string;
  providerName: string;
  lat: number;
  lng: number;
  radius?: number;
}

// Données des villes pour localiser les prestataires
const CITY_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  'Créteil': { lat: 48.9787, lng: 2.4531 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'Lyon': { lat: 45.7640, lng: 4.8357 },
  'Marseille': { lat: 43.2965, lng: 5.3698 },
  'Bordeaux': { lat: 44.8378, lng: -0.5795 },
  'Toulouse': { lat: 43.6047, lng: 1.4442 },
};

export default function InterventionMap({ zone, providerName, lat, lng, radius = 25000 }: InterventionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    const initMap = async () => {
      // Import Leaflet dynamiquement côté client seulement
      const L = await import('leaflet').then(m => m.default);

      // Fix pour les icônes
      const DefaultIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMERZRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOSAtNi05IC0xM2E5IDkgMCAwIDEgMTggMHoiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIj48L2NpcmNsZT48L3N2Zz4=',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
      });

      // Initialiser ou mettre à jour la carte
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current!).setView([lat, lng], 11);

        // Ajouter le layer OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
      } else {
        mapInstanceRef.current.setView([lat, lng], 11);
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Circle || layer instanceof L.Marker) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });
      }

      const map = mapInstanceRef.current;

      // Ajouter le cercle de zone d'intervention
      L.circle([lat, lng], {
        color: '#00D9FF',
        fillColor: '#00D9FF',
        fillOpacity: 0.1,
        weight: 2,
        radius: radius,
      }).addTo(map);

      // Ajouter le marqueur
      const marker = L.marker([lat, lng], {
        title: providerName,
        icon: DefaultIcon,
      }).addTo(map);

      // Ajouter une popup
      marker.bindPopup(
        `<div style="font-size: 12px;"><p style="font-weight: bold; margin: 0;">${providerName}</p><p style="margin: 4px 0 0 0; color: #666;">${zone}</p></div>`,
        { autoClose: false }
      );
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Circle || layer instanceof L.Marker) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });
      }
    };
  }, [isClient, lat, lng, radius, providerName, zone]);

  if (!isClient) {
    return (
      <div className="relative w-full h-96 rounded-xl overflow-hidden border border-cyan-500/30 bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden border border-cyan-500/30 bg-gray-900">
      <div
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      />

      {/* Infos overlay */}
      <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm border border-cyan-500/30 px-3 py-2 rounded-lg text-sm text-gray-300">
        <p className="text-cyan-400 font-semibold">Zone d'intervention</p>
        <p className="text-xs">{zone}</p>
      </div>
    </div>
  );
}

export { CITY_COORDINATES };
