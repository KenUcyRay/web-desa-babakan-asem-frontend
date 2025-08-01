import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const GisDesa = () => {
  // Data wilayah disimpan di state agar dinamis
  const [regions, setRegions] = useState([
    {
      id: 1,
      name: 'Dusun Mekarjaya',
      keluarga: 120,
      area: 1.8,
      coords: [
        [ -6.7560, 108.0430 ],
        [ -6.7560, 108.0460 ],
        [ -6.7590, 108.0460 ],
        [ -6.7590, 108.0430 ],
      ],
      color: '#3388ff',
    },
    {
      id: 2,
      name: 'Dusun Sukamaju',
      keluarga: 95,
      area: 1.2,
      coords: [
        [ -6.7540, 108.0470 ],
        [ -6.7540, 108.0490 ],
        [ -6.7565, 108.0490 ],
        [ -6.7565, 108.0470 ],
      ],
      color: '#33ff88',
    },
  ]);

  const [hovered, setHovered] = useState(null);

  return (
    <MapContainer
      center={[-6.7568, 108.0449]}
      zoom={14}
      className="w-full h-[500px] rounded-lg shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {regions.map((region) => (
        <Polygon
          key={region.id}
          positions={region.coords}
          pathOptions={{
            color: hovered === region.id ? '#ffa500' : region.color,
            weight: 2,
            fillOpacity: 0.6,
          }}
          eventHandlers={{
            mouseover: () => setHovered(region.id),
            mouseout: () => setHovered(null),
          }}
        >
          <Tooltip direction="center" permanent={false}>
            {region.name}
          </Tooltip>
          <Popup>
            <div>
              <strong>{region.name}</strong><br />
              Jumlah KK: {region.keluarga}<br />
              Luas: {region.area} ha
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
};

export default GisDesa;
