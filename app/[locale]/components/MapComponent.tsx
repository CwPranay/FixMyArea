'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix Leaflet icon paths (you can skip this if using CDN icons)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Red icon definition (optional if CDN URL used)
const redIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const issues: {
  id: number;
  position: [number, number]; // <- strict 2-item tuple
  description: string;
}[] = [
  {
    id: 1,
    position: [19.0760, 72.8777],
    description: 'Pothole near Andheri station',
  },
  {
    id: 2,
    position: [19.2183, 72.9781],
    description: 'Broken street light in Borivali',
  },
];


const centerPosition: [number, number] = [19.1071, 72.8376];


const MapComponent = () => {
  return (
    <MapContainer center={centerPosition} zoom={12} scrollWheelZoom={true} className="h-[400px] w-full rounded-2xl z-0 shadow">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {issues.map(issue => (
        <Marker key={issue.id} position={issue.position} icon={redIcon}>
          <Popup>{issue.description}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
