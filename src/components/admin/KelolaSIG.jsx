import { useState, useEffect, useRef } from "react";
import {
  FaMapMarkedAlt,
  FaDrawPolygon,
  FaMapPin,
  FaExclamationTriangle,
  FaEdit,
  FaSave,
  FaTrash,
  FaEye,
  FaPlus,
  FaClock,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import ColorPicker from "../ui/ColorPicker";
import EditableMap from "../ui/EditableMap";
import { MapApi } from "../../libs/api/MapApi";

export default function KelolaSIG() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("polygon");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [polygonData, setPolygonData] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [mapMode, setMapMode] = useState("view");
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [hiddenPolygons, setHiddenPolygons] = useState(new Set());
  const [hiddenMarkers, setHiddenMarkers] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [resetPolygon, setResetPolygon] = useState(false);
  const markerIconRef = useRef(null);

  // Form states
  const [polygonForm, setPolygonForm] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    coordinates: [],
    area: 0,
  });

  const [markerForm, setMarkerForm] = useState({
    name: "",
    type: "",
    description: "",
    coordinates: [],
    radius: 10,
    color: "#3B82F6",
    icon: null,
  });

  const colorPresets = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  const tabs = [
    {
      id: "polygon",
      name: "Polygon",
      icon: <FaDrawPolygon />,
      description: "Kelola area dan wilayah",
    },
    {
      id: "marker",
      name: "Marker",
      icon: <FaMapPin />,
      description: "Kelola titik lokasi",
    },
  ];

  // Load data on mount
  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      const result = await MapApi.getAll(i18n.language);

      if (result.data) {
        const data = result.data;

        const polygons = data
          .filter((item) => item.type === "POLYGON")
          .map((item) => {
            let coordinates = [];
            try {
              coordinates =
                typeof item.coordinates === "string"
                  ? JSON.parse(item.coordinates)
                  : item.coordinates;
            } catch (e) {
              coordinates = [];
            }
            return {
              ...item,
              type: "polygon",
              coordinates,
              color: item.color || "#3B82F6",
              updatedAt:
                item.updated_at || item.created_at || new Date().toISOString(),
            };
          });

        const markers = data
          .filter((item) => item.type === "MARKER" && !item.name.includes("["))
          .map((item) => {
            let coords = [];
            try {
              coords =
                typeof item.coordinates === "string"
                  ? JSON.parse(item.coordinates)
                  : item.coordinates;
            } catch (e) {
              coords = [];
            }

            let coordinate =
              Array.isArray(coords) && coords.length > 0
                ? coords[0]
                : { lat: 0, lng: 0 };
            if (Array.isArray(coordinate) && coordinate.length === 2) {
              coordinate = { lat: coordinate[0], lng: coordinate[1] };
            }

            return {
              ...item,
              type: "marker",
              coordinates: coordinate,
              color: item.color || "#3B82F6",
              updatedAt:
                item.updated_at || item.created_at || new Date().toISOString(),
            };
          });

        setPolygonData(polygons);
        setMarkerData(markers);
      }
    } catch (error) {
      console.error("Error loading map data:", error);
      alertError("Gagal memuat data peta");
    }
  };

  // Map event handlers
  const handlePolygonComplete = (coordinates) => {
    if (
      currentCoordinates &&
      JSON.stringify(currentCoordinates) === JSON.stringify(coordinates)
    )
      return;

    setCurrentCoordinates(coordinates);
    const area = calculatePolygonArea(coordinates);
    setPolygonForm((prev) => ({
      ...prev,
      coordinates,
      area,
      color: prev.color || selectedColor,
    }));
    setMapMode("view");
    alertSuccess("Polygon berhasil dibuat! Isi form untuk menyimpan.");
  };

  const handleMarkerPlace = (coordinates) => {
    setCurrentCoordinates(coordinates);
    setMarkerForm((prev) => ({
      ...prev,
      coordinates: [coordinates.lat, coordinates.lng],
    }));
  };

  // Calculate polygon area
  const calculatePolygonArea = (points) => {
    if (points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i][0] * points[j][1];
      area -= points[j][0] * points[i][1];
    }
    return Math.abs(area / 2) * 111320 * 111320;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Tidak diketahui";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Edit handlers
  const handleEditPolygon = (polygon) => {
    setEditingItem(polygon);
    setMapMode("edit");
    setActiveTab("polygon");
    setPolygonForm({
      name: polygon.name,
      description: polygon.description,
      color: polygon.color,
      coordinates: polygon.coordinates,
      area: calculatePolygonArea(polygon.coordinates),
    });
  };

  const handleEditMarker = (marker) => {
    setEditingItem(marker);
    setMapMode("edit");
    setActiveTab("marker");
    setMarkerForm({
      id: marker.id,
      type: marker.type,
      name: marker.name,
      description: marker.description,
      coordinates: marker.coordinates,
      radius: marker.radius,
      icon: marker.icon,
      color: marker.color,
      year: marker.year,
    });
  };

  const handlePolygonEdit = (updatedPolygon) => {
    // Update koordinat dan area saat polygon di-drag
    setCurrentCoordinates(updatedPolygon.coordinates);
    setPolygonForm((prev) => ({
      ...prev,
      coordinates: updatedPolygon.coordinates,
      area: calculatePolygonArea(updatedPolygon.coordinates),
    }));
  };

  // Save handlers - FIXED
  const handleSavePolygon = async () => {
    if (isSaving) return;
    if (
      !polygonForm.name ||
      !polygonForm.description ||
      !polygonForm.coordinates.length
    ) {
      alertError("Mohon lengkapi semua field dan gambar polygon di peta");
      return;
    }

    try {
      setIsSaving(true);

      // FIXED: Kirim sebagai object biasa, bukan FormData
      const payload = {
        type: "POLYGON",
        name: polygonForm.name,
        description: polygonForm.description,
        year: new Date().getFullYear(),
        coordinates: polygonForm.coordinates,
        color: polygonForm.color,
        area: polygonForm.area,
      };

      const result = await MapApi.create(payload, i18n.language);

      if (result.error) {
        throw new Error(result.message || "Gagal menyimpan polygon");
      }

      setPolygonForm({
        name: "",
        description: "",
        color: "#3B82F6",
        coordinates: [],
        area: 0,
      });
      setSelectedColor("#3B82F6");
      setCurrentCoordinates(null);
      setEditingItem(null);
      setResetPolygon(true);
      setTimeout(() => setResetPolygon(false), 100);
      setMapMode("view");
      await loadMapData();
      alertSuccess("Polygon berhasil disimpan!");
    } catch (error) {
      console.error("Save polygon error:", error);
      alertError(error.message || "Terjadi kesalahan saat menyimpan polygon");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMarker = async () => {
    if (isSaving) return;
    if (
      !markerForm.name ||
      !markerForm.coordinates.length ||
      !markerForm.description ||
      !markerForm.radius ||
      !markerForm.icon
    ) {
      alertError(
        "Mohon lengkapi semua field, tempatkan lokasi bencana di peta dan upload icon bencana"
      );
      return;
    }

    try {
      setIsSaving(true);

      // FIXED: Kirim sebagai object dengan file icon

      const payload = {
        type: "MARKER",
        name: markerForm.name,
        description: markerForm.description,
        year: new Date().getFullYear(),
        coordinates: [markerForm.coordinates], // Array of coordinates
        radius: markerForm.radius,
        icon: markerForm.icon, // File object
        color: markerForm.color,
      };

      const result = await MapApi.create(payload, i18n.language);

      if (result.error) {
        throw new Error(result.message || "Gagal menyimpan data bencana");
      }

      setMarkerForm({
        name: "",
        description: "",
        coordinates: [],
        radius: 10,
        icon: null,
        color: "#3B82F6",
      });

      markerIconRef.current.value = "";

      setCurrentCoordinates(null);
      await loadMapData();
      alertSuccess("Data bencana berhasil disimpan!");
    } catch (error) {
      console.error("Save bencana error:", error);
      alertError(
        error.message || "Terjadi kesalahan saat menyimpan data bencana"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Update handlers - FIXED
  const handleUpdatePolygon = async () => {
    if (
      !editingItem ||
      !polygonForm.name ||
      !polygonForm.description ||
      !polygonForm.coordinates.length
    ) {
      alertError("Mohon lengkapi semua field");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        type: "POLYGON",
        name: polygonForm.name,
        description: polygonForm.description,
        year: editingItem.year || new Date().getFullYear(),
        coordinates: polygonForm.coordinates,
        color: polygonForm.color,
      };

      const result = await MapApi.update(
        editingItem.id,
        payload,
        i18n.language
      );

      if (result.error) {
        throw new Error(result.message || "Gagal mengupdate polygon");
      }

      setPolygonForm({
        name: "",
        description: "",
        color: "#3B82F6",
        coordinates: [],
        area: 0,
      });
      setSelectedColor("#3B82F6");
      setCurrentCoordinates(null);
      setEditingItem(null);
      setMapMode("view");
      await loadMapData();
      alertSuccess("Polygon berhasil diupdate!");
    } catch (error) {
      console.error("Update error:", error);
      alertError(error.message || "Terjadi kesalahan saat mengupdate polygon");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMarker = async () => {
    if (!editingItem || !markerForm.name || !markerForm.type) {
      alertError("Mohon lengkapi semua field");
      return;
    }

    try {
      setIsSaving(true);

      let coordinates = markerForm.coordinates;
      if (!Array.isArray(coordinates)) {
        coordinates = [coordinates.lat, coordinates.lng];
      }

      const payload = {
        type: "MARKER",
        name: markerForm.name,
        description: markerForm.description,
        year: editingItem.year || new Date().getFullYear(),
        coordinates: [coordinates], // Array of coordinates
        radius: markerForm.radius,
        icon: markerForm.icon instanceof File ? markerForm.icon : null,
        color: markerForm.color,
      };

      const result = await MapApi.update(
        editingItem.id,
        payload,
        i18n.language
      );

      if (result.error) {
        throw new Error(result.message || "Gagal mengupdate data bencana");
      }

      setMarkerForm({
        name: "",
        type: "",
        description: "",
        coordinates: [],
        radius: 10,
        icon: null,
        color: "#3B82F6",
      });
      setCurrentCoordinates(null);
      setEditingItem(null);
      await loadMapData();
      alertSuccess("Data bencana berhasil diupdate!");
    } catch (error) {
      console.error("Update error:", error);
      alertError(
        error.message || "Terjadi kesalahan saat mengupdate data bencana"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handlers
  const handleDeletePolygon = async (id) => {
    try {
      const confirmation = await alertConfirm(
        "Apakah anda yakin ingin menghapus polygon ini?"
      );
      if (!confirmation) return;
      const result = await MapApi.delete(id, i18n.language);

      if (result.error) {
        throw new Error(result.message || "Gagal menghapus polygon");
      }

      if (editingItem && editingItem.id === id) {
        setEditingItem(null);
        setMapMode("view");
        setPolygonForm({
          name: "",
          description: "",
          color: "#3B82F6",
          coordinates: [],
          area: 0,
        });
        setSelectedColor("#3B82F6");
      }
      await loadMapData();
      alertSuccess("Polygon berhasil dihapus!");
    } catch (error) {
      alertError(error.message || "Gagal menghapus polygon");
    }
  };

  const handleDeleteMarker = async (id) => {
    try {
      const confirmation = await alertConfirm(
        "Apakah anda yakin ingin menghapus marker ini?"
      );
      if (!confirmation) return;

      const result = await MapApi.delete(id, i18n.language);
      if (result.error) {
        throw new Error(result.message || "Gagal menghapus data bencana");
      }

      if (editingItem && editingItem.id === id) {
        setEditingItem(null);
        setMarkerForm({
          name: "",
          type: "",
          description: "",
          coordinates: [],
          radius: 10,
          icon: null,
          color: "#3B82F6",
        });
      }
      await loadMapData();
      alertSuccess("Data bencana berhasil dihapus!");
    } catch (error) {
      alertError(error.message || "Gagal menghapus data bencana");
    }
  };

  // Visibility handlers
  const togglePolygonVisibility = (id) => {
    setHiddenPolygons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleMarkerVisibility = (id) => {
    setHiddenMarkers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setMapMode("view");
    setPolygonForm({
      name: "",
      description: "",
      color: "#3B82F6",
      coordinates: [],
      area: 0,
    });
    setMarkerForm({
      name: "",
      type: "",
      description: "",
      coordinates: [],
      radius: 10,
      icon: null,
      color: "#3B82F6",
    });
    setSelectedColor("#3B82F6");
  };

  // Render function untuk tab Bencana
  const renderMarkerTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Kelola Marker</h3>
        <button
          onClick={() => {
            const newMode = mapMode === "marker" ? "view" : "marker";
            setMapMode(newMode);
            if (newMode === "view") {
              setCurrentCoordinates(null);
              setMarkerForm((prev) => ({ ...prev, coordinates: [] }));
            }
          }}
          className={`flex items-center px-3 py-1 text-sm rounded ${
            mapMode === "marker"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <FaPlus className="mr-1" />
          {mapMode === "marker" ? "Batal" : "Tambah"}
        </button>
      </div>

      {/* Marker Form */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lokasi
          </label>
          <input
            type="text"
            value={markerForm.name}
            onChange={(e) =>
              setMarkerForm({ ...markerForm, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama lokasi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icon
          </label>
          <input
            type="file"
            accept="image/*"
            ref={markerIconRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setMarkerForm({ ...markerForm, icon: file });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {markerForm.icon instanceof File && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(markerForm.icon)}
                alt="Preview"
                className="h-20 w-20 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warna Radius
          </label>
          <ColorPicker
            value={markerForm.color}
            onChange={(color) => {
              setMarkerForm({ ...markerForm, color });
              setSelectedColor(color);
            }}
            presets={colorPresets}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Radius (meter)
          </label>
          <input
            type="number"
            value={markerForm.radius}
            onChange={(e) =>
              setMarkerForm({
                ...markerForm,
                radius: parseInt(e.target.value) || 10,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="5000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            value={markerForm.description}
            onChange={(e) =>
              setMarkerForm({ ...markerForm, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Deskripsi dan dampak potensial"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Koordinat
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              value={markerForm.coordinates[0] || ""}
              onChange={(e) =>
                setMarkerForm({
                  ...markerForm,
                  coordinates: [
                    parseFloat(e.target.value) || 0,
                    markerForm.coordinates[1] || 0,
                  ],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Latitude"
            />
            <input
              type="number"
              step="any"
              value={markerForm.coordinates[1] || ""}
              onChange={(e) =>
                setMarkerForm({
                  ...markerForm,
                  coordinates: [
                    markerForm.coordinates[0] || 0,
                    parseFloat(e.target.value) || 0,
                  ],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Longitude"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {editingItem ? (
          <>
            <button
              onClick={handleUpdateMarker}
              disabled={isSaving}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded ${
                isSaving
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <FaSave className="mr-2" />
              {isSaving ? "Mengupdate..." : "Update"}
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Batal
            </button>
          </>
        ) : (
          <button
            onClick={handleSaveMarker}
            disabled={
              isSaving ||
              !markerForm.name ||
              !markerForm.coordinates.length ||
              !markerForm.description ||
              !markerForm.icon
            }
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded ${
              isSaving ||
              !markerForm.name ||
              !markerForm.coordinates.length ||
              !markerForm.description ||
              !markerForm.icon
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <FaSave className="mr-2" />
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center mb-4">
              <FaMapMarkedAlt className="text-blue-600 text-2xl mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Kelola Sistem Informasi Geografis
                </h1>
                <p className="text-sm text-gray-500">
                  Kelola polygon, marker, dan sumber bencana di peta desa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 ">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Area */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Peta Interaktif
                </h2>
                <p className="text-sm text-gray-500">
                  Klik dan drag untuk mengelola data geografis
                </p>
              </div>
              <div className="p-3">
                <div className="h-96 md:h-[500px]">
                  <EditableMap
                    mode={mapMode}
                    onPolygonComplete={handlePolygonComplete}
                    onMarkerPlace={handleMarkerPlace}
                    onPolygonEdit={handlePolygonEdit}
                    existingData={[
                      ...polygonData.filter((p) => !hiddenPolygons.has(p.id)),
                      ...markerData.filter((m) => !hiddenMarkers.has(m.id)),
                    ]}
                    radius={markerForm.radius}
                    selectedColor={selectedColor}
                    editingItem={
                      editingItem?.type === "marker" ? markerForm : editingItem
                    }
                    setEditingItem={
                      editingItem?.type === "marker"
                        ? setMarkerForm
                        : setEditingItem
                    }
                    currentPolygon={polygonForm.coordinates.length > 0 ? polygonForm : null}
                    resetPolygon={resetPolygon}
                    defaultCenter={[-6.75, 108.05861]}
                    zoom={15}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b">
                <nav className="flex space-x-1 p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex flex-col items-center px-3 py-2 text-xs font-medium rounded-md transition ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-lg mb-1">{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {/* Polygon Tab */}
                {activeTab === "polygon" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Kelola Polygon</h3>
                      <button
                        onClick={() => {
                          if (mapMode === "polygon" || mapMode === "edit") {
                            // Reset semua state saat batal
                            setMapMode("view");
                            setCurrentCoordinates(null);
                            setPolygonForm({
                              name: "",
                              description: "",
                              color: "#3B82F6",
                              coordinates: [],
                              area: 0,
                            });
                            setEditingItem(null);
                          } else {
                            setMapMode("polygon");
                          }
                        }}
                        className={`flex items-center px-3 py-1 text-sm rounded ${
                          mapMode === "polygon" || mapMode === "edit"
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <FaPlus className="mr-1" />
                        {mapMode === "polygon" || mapMode === "edit" ? "Batal" : "Gambar"}
                      </button>
                    </div>

                    {/* Color Picker */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Warna Polygon
                      </label>
                      <ColorPicker
                        value={polygonForm.color}
                        onChange={(color) => {
                          setPolygonForm({ ...polygonForm, color });
                          setSelectedColor(color);
                        }}
                        presets={colorPresets}
                      />
                    </div>

                    {/* Polygon Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Area
                        </label>
                        <input
                          type="text"
                          value={polygonForm.name}
                          onChange={(e) =>
                            setPolygonForm({
                              ...polygonForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Masukkan nama area"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deskripsi
                        </label>
                        <textarea
                          value={polygonForm.description}
                          onChange={(e) =>
                            setPolygonForm({
                              ...polygonForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                          placeholder="Deskripsi area"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Luas Area
                        </label>
                        <input
                          type="text"
                          value={
                            polygonForm.area
                              ? `${polygonForm.area.toFixed(2)} m²`
                              : "Akan dihitung otomatis"
                          }
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {editingItem ? (
                        <>
                          <button
                            onClick={handleUpdatePolygon}
                            disabled={isSaving}
                            className={`flex-1 flex items-center justify-center px-4 py-2 rounded ${
                              isSaving
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            <FaSave className="mr-2" />
                            {isSaving ? "Mengupdate..." : "Update"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleSavePolygon}
                          disabled={
                            isSaving ||
                            !polygonForm.name ||
                            !polygonForm.description ||
                            !polygonForm.coordinates.length
                          }
                          className={`flex-1 flex items-center justify-center px-4 py-2 rounded ${
                            isSaving ||
                            !polygonForm.name ||
                            !polygonForm.description ||
                            !polygonForm.coordinates.length
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          <FaSave className="mr-2" />
                          {isSaving ? "Menyimpan..." : "Simpan"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Marker Tab */}
                {activeTab === "marker" && renderMarkerTab()}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-lg shadow bg-white overflow-hidden">
          <div className="p-3 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Data {activeTab === "polygon" ? "Polygon" : "Marker"} Tersimpan
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3">Tahun</th>
                  <th className="px-4 py-3">
                    Warna {activeTab === "polygon" ? "" : "Radius"}
                  </th>
                  {activeTab === "polygon" ? (
                    <>
                      <th className="px-4 py-3">Luas</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3">Icon</th>
                      <th className="px-4 py-3">Radius</th>
                    </>
                  )}
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {activeTab === "polygon"
                  ? polygonData.map((polygon, index) => (
                      <tr
                        key={polygon.id}
                        className="bg-white hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{polygon.name}</td>
                        <td className="px-4 py-3">{polygon.description}</td>
                        <td className="px-4 py-3">{polygon.year}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block w-4 h-4 rounded-full border`}
                            style={{ backgroundColor: polygon.color }}
                          ></span>
                        </td>
                        <td className="px-4 py-3">
                          {polygon.area} m<sup>2</sup>
                        </td>
                        {/* Aksi Buttons */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {/* Toggle Visibility */}
                            <button
                              onClick={() =>
                                togglePolygonVisibility(polygon.id)
                              }
                              className={`p-2 rounded transition ${
                                hiddenPolygons.has(polygon.id)
                                  ? "text-gray-400 hover:bg-gray-100"
                                  : "text-blue-600 hover:bg-blue-100"
                              }`}
                              title={
                                hiddenPolygons.has(polygon.id)
                                  ? "Tampilkan"
                                  : "Sembunyikan"
                              }
                            >
                              <FaEye className="text-sm" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleEditPolygon(polygon)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            >
                              <FaEdit className="text-xs" />
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeletePolygon(polygon.id)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                            >
                              <FaTrash className="text-xs" />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : markerData.map((marker, index) => (
                      <tr
                        key={marker.id}
                        className="bg-white hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{marker.name}</td>
                        <td className="px-4 py-3">{marker.description}</td>
                        <td className="px-4 py-3">{marker.year}</td>

                        {/* Warna */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-block w-4 h-4 rounded-full border"
                            style={{ backgroundColor: marker.color }}
                          ></span>
                        </td>

                        {/* Icon (pakai img) */}
                        <td className="px-4 py-3">
                          {marker.icon ? (
                            <img
                              src={`${
                                import.meta.env.VITE_NEW_BASE_URL
                              }/public/images/${marker.icon}`}
                              alt={marker.name}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <span className="text-gray-400 italic">
                              No Icon
                            </span>
                          )}
                        </td>

                        {/* Radius */}
                        <td className="px-4 py-3">{marker.radius} m</td>

                        {/* Aksi Buttons */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {/* Toggle Visibility */}
                            <button
                              onClick={() => toggleMarkerVisibility(marker.id)}
                              className={`p-2 rounded transition ${
                                hiddenMarkers.has(marker.id)
                                  ? "text-gray-400 hover:bg-gray-100"
                                  : "text-blue-600 hover:bg-blue-100"
                              }`}
                              title={
                                hiddenMarkers.has(marker.id)
                                  ? "Tampilkan"
                                  : "Sembunyikan"
                              }
                            >
                              <FaEye className="text-sm" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleEditMarker(marker)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            >
                              <FaEdit className="text-xs" />
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteMarker(marker.id)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                            >
                              <FaTrash className="text-xs" />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
