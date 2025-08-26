import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function InteractiveMap({
  mode = "view", // "polygon", "marker", "bencana", "view"
  onPolygonComplete,
  onMarkerPlace,
  onBencanaPlace,
  existingData = [],
  selectedColor = "#3B82F6",
  defaultCenter = [-6.75, 108.05861],
  zoom = 15,
}) {
  const [markerPos, setMarkerPos] = useState(null);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Reset states when mode changes
  useEffect(() => {
    setMarkerPos(null);
    setPolygonPoints([]);
    setIsDrawing(false);
  }, [mode]);

  // Custom icon for markers
  const getLeafletIcon = (color = "#3B82F6", size = 30) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  };

  // Map event handler
  function MapEventHandler() {
    useMapEvents({
      click(e) {
        if (mode === "marker") {
          const { lat, lng } = e.latlng;
          setMarkerPos({ lat, lng });
          if (onMarkerPlace) {
            onMarkerPlace({ lat, lng });
          }
        } else if (mode === "polygon" && isDrawing) {
          const { lat, lng } = e.latlng;
          const newPoints = [...polygonPoints, [lat, lng]];
          setPolygonPoints(newPoints);
        } else if (mode === "bencana") {
          const { lat, lng } = e.latlng;
          setMarkerPos({ lat, lng });
          if (onBencanaPlace) {
            onBencanaPlace({ lat, lng });
          }
        }
      },
    });
    return null;
  }

  // Handle marker drag
  const onMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPos({ lat, lng });
    if (mode === "marker" && onMarkerPlace) {
      onMarkerPlace({ lat, lng });
    } else if (mode === "bencana" && onBencanaPlace) {
      onBencanaPlace({ lat, lng });
    }
  };

  // Start/stop polygon drawing
  const togglePolygonDrawing = () => {
    if (isDrawing) {
      // Complete polygon
      if (polygonPoints.length >= 3) {
        if (onPolygonComplete) {
          onPolygonComplete(polygonPoints);
        }
      }
      setIsDrawing(false);
    } else {
      setPolygonPoints([]);
      setIsDrawing(true);
    }
  };

  // Undo last polygon point
  const undoLastPoint = () => {
    setPolygonPoints(prev => prev.slice(0, -1));
  };

  // Clear current drawing
  const clearDrawing = () => {
    setMarkerPos(null);
    setPolygonPoints([]);
    setIsDrawing(false);
  };

  // Calculate polygon area (rough estimation)
  const calculateArea = (points) => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i][0] * points[j][1];
      area -= points[j][0] * points[i][1];
    }
    return Math.abs(area / 2) * 111320 * 111320; // Rough conversion to m²
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      {mode !== "view" && (
        <div className="p-3 bg-white border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {mode === "polygon" && (
              <>
                <button
                  onClick={togglePolygonDrawing}
                  className={`px-3 py-1 text-sm rounded ${
                    isDrawing
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isDrawing ? "Selesai Gambar" : "Mulai Gambar"}
                </button>
                {polygonPoints.length > 0 && (
                  <button
                    onClick={undoLastPoint}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Undo ({polygonPoints.length})
                  </button>
                )}
              </>
            )}
            {(mode === "marker" || mode === "bencana") && markerPos && (
              <span className="text-sm text-green-600 font-medium">
                Lokasi: {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
              </span>
            )}
            {mode === "polygon" && polygonPoints.length > 0 && (
              <span className="text-sm text-blue-600 font-medium">
                Titik: {polygonPoints.length} | Luas: ~{Math.round(calculateArea(polygonPoints))} m²
              </span>
            )}
          </div>
          <button
            onClick={clearDrawing}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1">
        <MapContainer
          center={defaultCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Current Drawing - Polygon */}
          {polygonPoints.length > 0 && mode === "polygon" && (
            <Polygon
              positions={polygonPoints}
              pathOptions={{
                color: selectedColor,
                weight: 3,
                opacity: 0.8,
                fillColor: selectedColor,
                fillOpacity: 0.3,
              }}
            />
          )}

          {/* Current Drawing - Marker */}
          {markerPos && (mode === "marker" || mode === "bencana") && (
            <Marker
              position={[markerPos.lat, markerPos.lng]}
              icon={getLeafletIcon(
                mode === "bencana" ? "#EF4444" : selectedColor,
                36
              )}
              draggable={true}
              eventHandlers={{
                dragend: onMarkerDragEnd,
              }}
            />
          )}

          {/* Existing Data */}
          {existingData.map((item, index) => {
            if (item.type === "polygon" && item.coordinates) {
              return (
                <Polygon
                  key={`polygon-${index}`}
                  positions={item.coordinates}
                  pathOptions={{
                    color: item.color || "#3B82F6",
                    weight: 2,
                    opacity: 0.7,
                    fillColor: item.color || "#3B82F6",
                    fillOpacity: 0.2,
                  }}
                />
              );
            } else if (item.type === "marker" && item.coordinates) {
              return (
                <Marker
                  key={`marker-${index}`}
                  position={item.coordinates}
                  icon={getLeafletIcon(item.color || "#3B82F6", 30)}
                />
              );
            }
            return null;
          })}

          <MapEventHandler />
        </MapContainer>
      </div>

      {/* Instructions */}
      {mode !== "view" && (
        <div className="p-3 bg-gray-50 border-t text-sm text-gray-600">
          {mode === "polygon" && (
            <div>
              {isDrawing ? (
                <span className="text-blue-600 font-medium">
                  Klik di peta untuk menambah titik polygon. Minimal 3 titik diperlukan.
                </span>
              ) : (
                <span>Klik "Mulai Gambar" untuk membuat polygon baru.</span>
              )}
            </div>
          )}
          {mode === "marker" && (
            <span>Klik di peta untuk menempatkan marker. Drag untuk menyesuaikan posisi.</span>
          )}
          {mode === "bencana" && (
            <span>Klik di peta untuk menandai lokasi sumber bencana.</span>
          )}
        </div>
      )}
    </div>
  );
}