import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
  Circle,
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

export default function EditableMap({
  mode = "view", // "polygon", "marker", "bencana", "view", "edit"
  onPolygonComplete,
  onMarkerPlace,
  onBencanaPlace,
  onPolygonEdit,
  existingData = [],
  selectedColor = "#3B82F6",
  editingItem = null,
  bencanaRadius = 500,
  defaultCenter = [-6.75, 108.05861],
  zoom = 15,
}) {
  const [markerPos, setMarkerPos] = useState(null);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [editingVertices, setEditingVertices] = useState([]);

  // Reset states when mode changes
  useEffect(() => {
    if (mode !== "edit") {
      setMarkerPos(null);
      setPolygonPoints([]);
      setIsDrawing(false);
      setEditingVertices([]);
    }
  }, [mode]);

  // Set editing data when editingItem changes
  useEffect(() => {
    if (mode === "edit" && editingItem) {
      if (editingItem.type === "polygon" && editingItem.coordinates) {
        setPolygonPoints(editingItem.coordinates);
        setEditingVertices(editingItem.coordinates.map((coord, index) => ({ 
          id: index, 
          position: coord 
        })));
      } else if (editingItem.type === "marker" && editingItem.coordinates) {
        setMarkerPos({ 
          lat: editingItem.coordinates[0], 
          lng: editingItem.coordinates[1] 
        });
      }
    }
  }, [mode, editingItem]);

  // Simple vertex icon
  const getVertexIcon = () => {
    return L.divIcon({
      className: 'vertex-marker',
      html: `<div style="
        background-color: white;
        width: 12px;
        height: 12px;
        border: 2px solid #3B82F6;
        border-radius: 50%;
        cursor: move;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      "></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  // Simple clean marker icon
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
        box-shadow: 0 3px 8px rgba(0,0,0,0.2);
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
    } else if (mode === "edit" && onPolygonEdit) {
      onPolygonEdit({ ...editingItem, coordinates: [lat, lng] });
    }
  };

  // Handle vertex drag
  const onVertexDragEnd = (vertexIndex, e) => {
    const { lat, lng } = e.target.getLatLng();
    const newPoints = [...polygonPoints];
    newPoints[vertexIndex] = [lat, lng];
    setPolygonPoints(newPoints);
    
    const newVertices = [...editingVertices];
    newVertices[vertexIndex].position = [lat, lng];
    setEditingVertices(newVertices);

    if (onPolygonEdit) {
      onPolygonEdit({ ...editingItem, coordinates: newPoints });
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
    setEditingVertices([]);
  };

  // Calculate polygon area
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
      {(mode !== "view" && mode !== "edit") && (
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

      {/* Edit Mode Controls */}
      {mode === "edit" && (
        <div className="p-3 bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-700">
                Mode Edit: {editingItem?.name || "Item"}
              </span>
              {editingItem?.type === "polygon" && polygonPoints.length > 0 && (
                <span className="text-sm text-blue-600">
                  Titik: {polygonPoints.length} | Luas: ~{Math.round(calculateArea(polygonPoints))} m²
                </span>
              )}
            </div>
            <span className="text-xs text-blue-600">
              Drag titik untuk mengubah bentuk
            </span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1">
        <MapContainer
          center={defaultCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg"
          zoomControl={true}
        >
          {/* Google Maps Style */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {/* Current Drawing - Polygon */}
          {polygonPoints.length > 0 && (mode === "polygon" || mode === "edit") && (
            <Polygon
              positions={polygonPoints}
              pathOptions={{
                color: selectedColor,
                weight: 3,
                opacity: 0.9,
                fillColor: selectedColor,
                fillOpacity: mode === "edit" ? 0.25 : 0.35,
                dashArray: mode === "edit" ? "10, 5" : null,
              }}
            />
          )}

          {/* Editing Vertices */}
          {mode === "edit" && editingItem?.type === "polygon" && editingVertices.map((vertex, index) => (
            <Marker
              key={`vertex-${index}`}
              position={vertex.position}
              icon={getVertexIcon()}
              draggable={true}
              eventHandlers={{
                dragend: (e) => onVertexDragEnd(index, e),
              }}
            />
          ))}

          {/* Current Drawing - Marker */}
          {markerPos && (mode === "marker" || mode === "bencana" || mode === "edit") && (
            <React.Fragment>
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
              {/* Circle for bencana mode */}
              {mode === "bencana" && bencanaRadius && bencanaRadius > 0 && (
                <Circle
                  center={[markerPos.lat, markerPos.lng]}
                  radius={bencanaRadius}
                  pathOptions={{
                    color: "#EF4444",
                    weight: 2,
                    opacity: 0.6,
                    fillColor: "#EF4444",
                    fillOpacity: 0.1,
                  }}
                />
              )}
              {/* Circle for edit mode bencana */}
              {mode === "edit" && editingItem?.type === "marker" && editingItem?.name?.includes('[') && (
                <Circle
                  center={[markerPos.lat, markerPos.lng]}
                  radius={editingItem.radius || 500}
                  pathOptions={{
                    color: "#EF4444",
                    weight: 2,
                    opacity: 0.6,
                    fillColor: "#EF4444",
                    fillOpacity: 0.1,
                  }}
                />
              )}
            </React.Fragment>
          )}

          {/* Existing Data */}
          {existingData.map((item, index) => {
            // Skip item being edited
            if (mode === "edit" && editingItem && item.id === editingItem.id) {
              return null;
            }

            if (item.type === "polygon" && item.coordinates) {
              return (
                <Polygon
                  key={`polygon-${index}`}
                  positions={item.coordinates}
                  pathOptions={{
                    color: item.color || "#3B82F6",
                    weight: 2.5,
                    opacity: 0.8,
                    fillColor: item.color || "#3B82F6",
                    fillOpacity: 0.25,
                  }}
                />
              );
            } else if (item.type === "marker" && item.coordinates) {
              const isBencana = item.name && item.name.includes('[');
              return (
                <React.Fragment key={`marker-${index}`}>
                  <Marker
                    position={item.coordinates}
                    icon={getLeafletIcon(item.color || "#3B82F6", 30)}
                  />
                  {/* Circle for bencana with radius */}
                  {isBencana && item.radius && (
                    <Circle
                      center={item.coordinates}
                      radius={item.radius}
                      pathOptions={{
                        color: item.color || "#EF4444",
                        weight: 2.5,
                        opacity: 0.7,
                        fillColor: item.color || "#EF4444",
                        fillOpacity: 0.15,
                        dashArray: "8, 4",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            }
            return null;
          })}

          <MapEventHandler />
        </MapContainer>
        

      </div>

      {/* Instructions */}
      {mode !== "view" && mode !== "edit" && (
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

      {/* Edit Instructions */}
      {mode === "edit" && (
        <div className="p-3 bg-blue-50 border-t text-sm text-blue-700">
          {editingItem?.type === "polygon" ? (
            <span>Drag titik-titik biru untuk mengubah bentuk polygon. Perubahan akan tersimpan otomatis.</span>
          ) : (
            <span>Drag marker untuk mengubah posisi. Perubahan akan tersimpan otomatis.</span>
          )}
        </div>
      )}
    </div>
  );
}