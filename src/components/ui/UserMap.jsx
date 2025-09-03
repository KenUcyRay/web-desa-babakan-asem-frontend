import React, { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MapApi } from "../../libs/api/MapApi";
import { useTranslation } from "react-i18next";

// Icon custom
const createIcon = (iconUrl) => {
  if (!iconUrl) {
    return new L.Icon.Default();
  }
  return L.icon({
    iconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Palet warna untuk polygon
const polygonColors = [
  "#dc2626", "#2563eb", "#059669", "#f59e42",
  "#a21caf", "#eab308", "#0ea5e9", "#f43f5e",
];

function getPolygonColorByIndex(index) {
  return polygonColors[index % polygonColors.length];
}

// Helper functions
function tryParseJSON(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
  return value;
}

function normalizePolygonCoordinates(input) {
  const parsed = tryParseJSON(input) ?? input;
  if (!Array.isArray(parsed) || parsed.length === 0) return null;

  if (typeof parsed[0] === "number") {
    return null;
  }

  let coordsArray = parsed;
  if (Array.isArray(parsed[0]) && Array.isArray(parsed[0][0])) {
    coordsArray = parsed[0];
  }

  const mapped = coordsArray
    .map((pt) => {
      if (!Array.isArray(pt) || pt.length < 2) return null;
      const lng = Number(pt[0]);
      const lat = Number(pt[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
      return null;
    })
    .filter(Boolean);

  return mapped.length ? mapped : null;
}

function normalizeMarkerCoordinates(input) {
  const parsed = tryParseJSON(input) ?? input;
  if (Array.isArray(parsed)) {
    if (parsed.length >= 2 && typeof parsed[0] === "number") {
      const lng = Number(parsed[0]);
      const lat = Number(parsed[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return [[lat, lng]];
    }
    if (Array.isArray(parsed[0]) && parsed[0].length >= 2) {
      const lng = Number(parsed[0][0]);
      const lat = Number(parsed[0][1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return [[lat, lng]];
    }
  }
  if (parsed && typeof parsed === "object") {
    const lat = Number(parsed.lat ?? parsed.latitude ?? parsed[1] ?? parsed[0]);
    const lng = Number(parsed.lng ?? parsed.longitude ?? parsed[0] ?? parsed[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [[lat, lng]];
  }
  return null;
}

export default function UserMap() {
  const { i18n } = useTranslation();
  const [mapData, setMapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMapData = async () => {
    try {
      setIsLoading(true);
      const response = await MapApi.getAll(i18n.language);

      if (!response.ok) {
        throw new Error("Gagal mengambil data peta");
      }

      const responseData = await response.json();
      const formattedData = [];

      if (responseData.data && Array.isArray(responseData.data)) {
        responseData.data.forEach((item) => {
          try {
            if (item.type === "POLYGON") {
              const normalized = normalizePolygonCoordinates(item.coordinates);
              if (!normalized) return;

              formattedData.push({
                id: item.id,
                name: item.name,
                description: item.description || "Wilayah Desa",
                type: "polygon",
                coordinates: normalized,
              });
            } else if (item.type === "MARKER") {
              const normalized = normalizeMarkerCoordinates(item.coordinates);
              if (!normalized) return;

              formattedData.push({
                id: item.id,
                name: item.name,
                description: item.description || "Point of Interest",
                type: "marker",
                coordinates: normalized,
                icon: item.icon
                  ? `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${item.icon}`
                  : null,
              });
            }
          } catch (err) {
            console.error("Error processing map item:", err);
          }
        });
      }

      setMapData(formattedData);
    } catch (error) {
      console.error("Error fetching map data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [i18n.language]);

  // Buat array poligon legend yang sinkron dengan warna di peta
  const polygonLegendData = useMemo(() => {
    return mapData
      .filter((item) => item.type === "polygon")
      .map((region, idx) => ({
        id: region.id,
        name: region.name,
        color: getPolygonColorByIndex(idx),
        label: `Batas ${region.name}`,
      }));
  }, [mapData]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-3 text-gray-600">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-md border-2 border-green-100">
      <MapContainer
        center={[-6.75, 108.05861]}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-96 z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapData.map((item) =>
          item.type === "polygon" ? (
            (() => {
              const polygonIdx = polygonLegendData.findIndex(
                (p) => p.id === item.id
              );
              const color = polygonLegendData[polygonIdx]?.color || "#2563eb";
              return (
                <Polygon
                  key={item.id}
                  positions={item.coordinates}
                  pathOptions={{
                    color,
                    weight: 2,
                    dashArray: "4, 4",
                    fillColor: "transparent",
                    opacity: 0.9,
                  }}
                >
                  <LeafletTooltip permanent={false} direction="center">
                    {item.name}
                  </LeafletTooltip>
                  <Popup>
                    <div className="text-center">
                      <strong className="text-base" style={{ color }}>
                        {item.name}
                      </strong>
                      <p className="text-sm my-2">{item.description}</p>
                      <p className="text-xs text-gray-600">
                        Kecamatan: Congeang
                      </p>
                    </div>
                  </Popup>
                </Polygon>
              );
            })()
          ) : (
            <Marker
              key={item.id}
              position={item.coordinates[0]}
              icon={createIcon(item.icon)}
            >
              <LeafletTooltip permanent={false}>{item.name}</LeafletTooltip>
              <Popup>
                <div className="text-center">
                  <strong className="text-base text-green-600">
                    {item.name}
                  </strong>
                  <p className="text-sm my-2">{item.description}</p>
                </div>
              </Popup>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
}