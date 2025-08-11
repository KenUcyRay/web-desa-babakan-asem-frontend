import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

const MAP_TYPES = [
  { value: "POLYGON", label: "Polygon" },
  { value: "MARKER", label: "Marker" },
];

const DialogMap = ({
  onSubmit,
  onClose,
  year: propYear,
  polygonData = null,
  defaultCenter = [-6.75, 108.05861],
}) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef(null);

  // FORM STATE
  const [formData, setFormData] = useState({
    type: "POLYGON",
    name: "",
    description: "",
    year: propYear || 2025,
    icon: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState("");
  const fileInputRef = useRef();

  // MAP STATE
  const [markerPos, setMarkerPos] = useState(null);
  const [polygonPoints, setPolygonPoints] = useState(
    polygonData && Array.isArray(polygonData) ? polygonData : []
  );

  // Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (iconPreview) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);

  // Sync year prop
  useEffect(() => {
    if (propYear) {
      setFormData((p) => ({ ...p, year: propYear }));
    }
  }, [propYear]);

  // --- HANDLE CHANGE ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "icon") {
      if (files && files[0]) {
        setFormData((prev) => ({ ...prev, icon: files[0] }));
        const url = URL.createObjectURL(files[0]);
        setIconPreview(url);
      } else {
        setFormData((prev) => ({ ...prev, icon: null }));
        setIconPreview("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- HANDLE SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};
    if (!formData.name) newErrors.name = "Wajib diisi";
    if (!formData.description) newErrors.description = "Wajib diisi";

    if (formData.type === "MARKER" && !markerPos) {
      newErrors.coordinates = "Pilih lokasi marker pada peta";
    }
    if (formData.type === "POLYGON" && polygonPoints.length < 3) {
      newErrors.coordinates = "Polygon harus memiliki minimal 3 titik";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        coordinates:
          formData.type === "MARKER"
            ? JSON.stringify([[markerPos.lng, markerPos.lat]])
            : JSON.stringify(polygonPoints.map((pt) => [pt[1], pt[0]])),
      };
      if (onSubmit) {
        await onSubmit(dataToSubmit);
      }
      if (onClose) onClose();
    } catch (error) {
      console.error("Error menyimpan data peta:", error);
      setErrors({
        submission: "Gagal menyimpan data peta",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- MAP FUNCTIONS ---
  const getLeafletIcon = (size = 30) => {
    const iconUrl =
      iconPreview ||
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
    return L.icon({
      iconUrl,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      shadowSize: [size, size],
      shadowAnchor: [size / 2, size],
    });
  };

  function LocationPicker() {
    useMapEvents({
      click(e) {
        if (formData.type === "MARKER") {
          if (e.originalEvent) e.originalEvent.stopPropagation();
          const { lat, lng } = e.latlng;
          setMarkerPos({ lat, lng });
        } else if (formData.type === "POLYGON") {
          if (e.originalEvent) e.originalEvent.stopPropagation();
          const { lat, lng } = e.latlng;
          setPolygonPoints((prev) => [...prev, [lat, lng]]);
        }
      },
      mousedown(e) {
        if (e.originalEvent) e.originalEvent.stopPropagation();
      },
      dblclick(e) {
        if (e.originalEvent) e.originalEvent.stopPropagation();
      },
    });
    return null;
  }

  const onMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPos({ lat, lng });
  };

  const undoLastPoint = () => {
    setPolygonPoints((prev) => prev.slice(0, prev.length - 1));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white backdrop-blur-lg border border-green-200 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 relative">
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-200 text-3xl font-bold z-50 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-white pr-12">
            Tambah Data Peta
          </h2>
          <p className="text-green-100 mt-1">
            Buat marker peta baru atau area polygon
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: FORM */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selection */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-gray-700 font-semibold mb-3">
                    Tipe Peta <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {MAP_TYPES.map((opt) => (
                      <label key={opt.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={opt.value}
                          checked={formData.type === opt.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`
                            p-3 border-2 rounded-lg text-center font-medium transition-all duration-200
                            ${
                              formData.type === opt.value
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                            }
                          `}
                        >
                          {opt.label}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.type && (
                    <span className="text-xs text-red-500 mt-2 block">
                      {errors.type}
                    </span>
                  )}
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nama <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200`}
                      placeholder="Contoh: Babakan Asem"
                    />
                    {errors.name && (
                      <span className="text-xs text-red-500 mt-1 block">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Tahun <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className={`w-full border ${
                        errors.year ? "border-red-500" : "border-gray-300"
                      } rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200`}
                      min={1900}
                      max={2100}
                      placeholder="Contoh: 2025"
                    />
                    {errors.year && (
                      <span className="text-xs text-red-500 mt-1 block">
                        {errors.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 resize-none`}
                    placeholder="Deskripsikan area atau lokasi ini..."
                  />
                  {errors.description && (
                    <span className="text-xs text-red-500 mt-1 block">
                      {errors.description}
                    </span>
                  )}
                </div>

                {/* Icon Upload (only for MARKER) */}
                {formData.type === "MARKER" && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <label className="block text-gray-700 font-semibold mb-3">
                      Icon Kustom
                      <span className="text-xs text-gray-500 ml-2 font-normal">
                        (PNG/JPG/SVG - Opsional)
                      </span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        name="icon"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                      />
                      {formData.icon && (
                        <button
                          type="button"
                          className="text-sm text-red-500 hover:text-red-700 font-medium"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, icon: null }));
                            setIconPreview("");
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    {iconPreview && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={iconPreview}
                          alt="icon preview"
                          className="h-12 w-12 object-contain border-2 border-blue-200 rounded-lg shadow-sm bg-white"
                        />
                        <span className="text-sm text-gray-600">
                          Preview icon
                        </span>
                      </div>
                    )}
                    {errors.icon && (
                      <span className="text-xs text-red-500 mt-2 block">
                        {errors.icon}
                      </span>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* RIGHT: MAP */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  🗺️ Peta Interaktif
                </h3>

                {/* Map Status Info */}
                <div className="mb-4 p-3 bg-white rounded-lg border text-sm">
                  {formData.type === "MARKER" ? (
                    markerPos ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Lokasi Dipilih:</span>
                        <span className="font-mono">
                          {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Klik di peta untuk memilih lokasi</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span>Preview area polygon</span>
                    </div>
                  )}
                </div>

                {/* Map Container */}
                <div className="h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg relative">
                  <div style={{ height: "100%", width: "100%" }}>
                    <MapContainer
                      center={
                        formData.type === "MARKER"
                          ? markerPos || defaultCenter
                          : polygonPoints.length > 0
                          ? polygonPoints[0]
                          : defaultCenter
                      }
                      zoom={15}
                      style={{ height: "100%", width: "100%" }}
                      className="rounded-xl"
                      ref={mapContainerRef}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* Polygon */}
                      {polygonPoints.length > 0 &&
                        formData.type === "POLYGON" && (
                          <Polygon
                            positions={polygonPoints}
                            pathOptions={{
                              color: "#ef4444",
                              weight: 3,
                              opacity: 0.8,
                              fillColor: "#ef4444",
                              fillOpacity: 0.2,
                            }}
                          />
                        )}

                      {/* Marker */}
                      {markerPos && formData.type === "MARKER" && (
                        <Marker
                          position={[markerPos.lat, markerPos.lng]}
                          icon={getLeafletIcon(36)}
                          draggable={true}
                          eventHandlers={{
                            dragend: onMarkerDragEnd,
                            click: (e) => {
                              if (e.originalEvent)
                                e.originalEvent.stopPropagation();
                            },
                          }}
                        />
                      )}

                      <LocationPicker />
                    </MapContainer>
                  </div>
                </div>

                {/* Map Instructions */}
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  {formData.type === "MARKER" ? (
                    <>
                      <div>
                        • Klik di mana saja pada peta untuk menempatkan marker
                      </div>
                      <div>• Seret marker untuk menyesuaikan posisi</div>
                    </>
                  ) : (
                    <div>• Klik pada peta untuk menambah titik polygon</div>
                  )}
                </div>

                {/* Undo Polygon Point */}
                {formData.type === "POLYGON" && polygonPoints.length > 0 && (
                  <button
                    type="button"
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    onClick={undoLastPoint}
                  >
                    Batalkan Titik Terakhir
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-200"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
          {errors.submission && (
            <p className="text-red-600 mt-4 font-semibold">
              {errors.submission}
            </p>
          )}
          {errors.coordinates && (
            <p className="text-red-600 mt-4 font-semibold">
              {errors.coordinates}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogMap;
