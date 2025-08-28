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
import { FaTrash, FaMapMarkedAlt, FaDrawPolygon } from "react-icons/fa";
import { MapApi } from "../../libs/api/MapApi";
import { alertConfirm, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
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

function safeToFixedMaybe(val, dec = 6) {
  const num = Number(val);
  if (Number.isFinite(num)) return num.toFixed(dec);
  return "N/A";
}

export default function AdminMap({ onDataChange }) {
  const { i18n } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [mapData, setMapData] = useState([]);

  const fetchMapData = async () => {
    try {
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
                year: item.year || 2025,
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
                year: item.year || 2025,
                coordinates: normalized,
                icon: item.icon
                  ? `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${item.icon}`
                  : null,
              });
            }
          } catch (err) {
            console.log("Error processing item:", err);
          }
        });
      }

      setMapData(formattedData);
      if (onDataChange) {
        onDataChange(formattedData);
      }
    } catch (error) {
      console.log("Error fetching map data:", error);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [i18n.language, selectedYear]);

  // Filter data berdasarkan tahun
  const filteredData = mapData.filter((d) => d.year <= selectedYear);

  // Buat array poligon legend yang sinkron dengan warna di peta
  const polygonLegendData = useMemo(() => {
    return filteredData
      .filter((item) => item.type === "polygon")
      .map((region, idx) => ({
        id: region.id,
        name: region.name,
        color: getPolygonColorByIndex(idx),
        label: `Batas ${region.name}`,
      }));
  }, [filteredData]);

  // Extract unique years
  const uniqueYears = useMemo(() => {
    if (!mapData.length) return [new Date().getFullYear()];
    const years = [...new Set(mapData.map((item) => item.year))];
    return years.sort((a, b) => b - a);
  }, [mapData]);

  useEffect(() => {
    if (uniqueYears.length > 0 && !uniqueYears.includes(selectedYear)) {
      setSelectedYear(uniqueYears[0]);
    }
  }, [uniqueYears, selectedYear]);

  const handleDeleteMapItem = async (id, name, type) => {
    const confirmed = await alertConfirm(
      `Hapus data peta?`,
      `Anda yakin ingin menghapus ${
        type === "polygon" ? "wilayah" : "titik"
      } "${name}"? Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmed) return;

    const response = await MapApi.delete(id, i18n.language);

    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }

    await fetchMapData();
    alertSuccess(
      `Berhasil menghapus ${
        type === "polygon" ? "wilayah" : "titik"
      } "${name}".`
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400 to-[#B6F500] p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <FaMapMarkedAlt className="text-blue-700" />
            </div>
            Peta Digital Desa
          </h2>

          <div className="flex items-center gap-2">
            <label className="text-black font-medium text-sm">
              Pilih Tahun:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-2 py-1 rounded-md border text-sm"
            >
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="p-4">
        <div className="rounded-lg overflow-hidden shadow-md border-2 border-green-100">
          <MapContainer
            center={[-6.75, 108.05861]}
            zoom={15}
            scrollWheelZoom={true}
            className="w-full h-[400px] lg:h-[500px] z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredData.map((item) =>
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
                      <strong className="text-base text-red-600">
                        {item.name}
                      </strong>
                      <p className="text-sm my-2">{item.description}</p>
                      <p className="text-xs text-gray-600">
                        Koordinat:{" "}
                        {safeToFixedMaybe(item.coordinates[0][0], 6)},{" "}
                        {safeToFixedMaybe(item.coordinates[0][1], 6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )
            )}
          </MapContainer>
        </div>
      </div>

      {/* Legend - Compact */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <FaMapMarkedAlt className="text-green-600" />
          Data Tersimpan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Polygon Legend */}
          {polygonLegendData.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FaDrawPolygon className="text-blue-500 mr-2" />
                Wilayah ({polygonLegendData.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {polygonLegendData.map((poly) => (
                  <div
                    key={`legend-poly-${poly.id}`}
                    className="flex items-center justify-between p-2 bg-white rounded border group hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-0 border-t-2 border-dashed"
                        style={{ borderColor: poly.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {poly.name}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteMapItem(poly.id, poly.name, "polygon")
                      }
                      className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marker Legend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <FaMapMarkedAlt className="text-red-500 mr-2" />
              Marker ({filteredData.filter(item => item.type === "marker").length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filteredData
                .filter((item) => item.type === "marker")
                .map((marker) => (
                  <div
                    key={`marker-${marker.id}`}
                    className="flex items-center justify-between p-2 bg-white rounded border group hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 bg-contain bg-center bg-no-repeat rounded border"
                        style={{
                          backgroundImage: `url('${marker.icon}')`,
                          backgroundSize: "contain",
                        }}
                      ></div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 block">
                          {marker.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {safeToFixedMaybe(marker.coordinates[0][0], 4)},{" "}
                          {safeToFixedMaybe(marker.coordinates[0][1], 4)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteMapItem(marker.id, marker.name, "marker")
                      }
                      className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              {filteredData.filter(item => item.type === "marker").length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-2">
                  Belum ada marker
                </p>
              )}
            </div>
          </div>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FaMapMarkedAlt className="mx-auto mb-2 text-4xl" />
            <p>Belum ada data peta untuk ditampilkan</p>
          </div>
        )}
      </div>
    </div>
  );
}