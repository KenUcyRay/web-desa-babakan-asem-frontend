import { useState, useEffect } from "react";
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
import { alertError, alertSuccess } from "../../libs/alert";
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
  const [hiddenBencana, setHiddenBencana] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [polygonForm, setPolygonForm] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    coordinates: [],
    area: 0,
  });

  const [bencanaForm, setBencanaForm] = useState({
    name: "",
    type: "",
    description: "",
    coordinates: [],
    radius: 10,
    icon: null,
  });

  // Data constants
  const riskLevels = [
    { value: "rendah", label: "Rendah", color: "green" },
    { value: "sedang", label: "Sedang", color: "yellow" },
    { value: "tinggi", label: "Tinggi", color: "red" },
  ];
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
    alertSuccess("Marker berhasil ditempatkan! Isi form untuk menyimpan.");
  };

  const handleBencanaPlace = (coordinates) => {
    setCurrentCoordinates(coordinates);
    setBencanaForm((prev) => ({
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

  const handleEditBencana = (bencana) => {
    setEditingItem(bencana);
    setActiveTab("bencana");

    const cleanName = bencana.name.replace(/\[.*?\]/g, "").trim();

    setBencanaForm({
      name: cleanName,
      type: bencana.type || "",
      description: bencana.description || "",
      riskLevel: bencana.riskLevel || "rendah",
      coordinates: [bencana.coordinates.lat, bencana.coordinates.lng],
      radius: bencana.radius || 10,
      icon: null,
    });
  };

  const handlePolygonEdit = (updatedPolygon) => {
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

  const handleSaveBencana = async () => {
    if (isSaving) return;
    if (
      !bencanaForm.name ||
      !bencanaForm.coordinates.length ||
      !bencanaForm.description ||
      !bencanaForm.radius ||
      !bencanaForm.icon
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
        name: bencanaForm.name,
        description: bencanaForm.description,
        year: new Date().getFullYear(),
        coordinates: [bencanaForm.coordinates], // Array of coordinates
        radius: bencanaForm.radius,
        icon: bencanaForm.icon, // File object
      };

      const result = await MapApi.create(payload, i18n.language);

      if (result.error) {
        throw new Error(result.message || "Gagal menyimpan data bencana");
      }

      setBencanaForm({
        name: "",
        description: "",
        coordinates: [],
        radius: 10,
        icon: null,
      });
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

  const handleUpdateBencana = async () => {
    if (!editingItem || !bencanaForm.name || !bencanaForm.type) {
      alertError("Mohon lengkapi semua field");
      return;
    }

    try {
      setIsSaving(true);
      const riskLabel =
        riskLevels.find((r) => r.value === bencanaForm.riskLevel)?.label ||
        "Rendah";

      // FIXED: Kirim sebagai object, bukan FormData langsung
      const payload = {
        type: "BENCANA",
        name: `[${riskLabel}] ${bencanaForm.name}`,
        description: bencanaForm.description,
        year: editingItem.year || new Date().getFullYear(),
        coordinates: [bencanaForm.coordinates], // Array of coordinates
        radius: bencanaForm.radius,
        icon: bencanaForm.icon instanceof File ? bencanaForm.icon : null,
      };

      const result = await MapApi.update(
        editingItem.id,
        payload,
        i18n.language
      );

      if (result.error) {
        throw new Error(result.message || "Gagal mengupdate data bencana");
      }

      setBencanaForm({
        name: "",
        type: "",
        description: "",
        coordinates: [],
        radius: 10,
        icon: null,
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

  const handleDeleteBencana = async (id) => {
    try {
      const result = await MapApi.delete(id, i18n.language);
      if (result.error) {
        throw new Error(result.message || "Gagal menghapus data bencana");
      }

      if (editingItem && editingItem.id === id) {
        setEditingItem(null);
        setBencanaForm({
          name: "",
          type: "",
          description: "",
          riskLevel: "rendah",
          coordinates: [],
          radius: 10,
          icon: null,
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

  const toggleBencanaVisibility = (id) => {
    setHiddenBencana((prev) => {
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
    setBencanaForm({
      name: "",
      type: "",
      description: "",
      coordinates: [],
      radius: 10,
      icon: null,
    });
    setSelectedColor("#3B82F6");
  };

  // Render function untuk tab Bencana
  const renderMarkerTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Kelola Sumber Bencana</h3>
        <button
          onClick={() => {
            const newMode = mapMode === "bencana" ? "view" : "bencana";
            setMapMode(newMode);
            if (newMode === "view") {
              setCurrentCoordinates(null);
              setBencanaForm((prev) => ({ ...prev, coordinates: [] }));
            }
          }}
          className={`flex items-center px-3 py-1 text-sm rounded ${
            mapMode === "bencana"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <FaPlus className="mr-1" />
          {mapMode === "bencana" ? "Batal" : "Tambah"}
        </button>
      </div>

      {/* Bencana Form */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lokasi Bencana
          </label>
          <input
            type="text"
            value={bencanaForm.name}
            onChange={(e) =>
              setBencanaForm({ ...bencanaForm, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama lokasi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icon Bencana
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setBencanaForm({ ...bencanaForm, icon: file });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {bencanaForm.icon instanceof File && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(bencanaForm.icon)}
                alt="Preview"
                className="h-20 w-20 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Radius (meter)
          </label>
          <input
            type="number"
            value={bencanaForm.radius}
            onChange={(e) =>
              setBencanaForm({
                ...bencanaForm,
                radius: parseInt(e.target.value) || 10,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            max="5000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            value={bencanaForm.description}
            onChange={(e) =>
              setBencanaForm({ ...bencanaForm, description: e.target.value })
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
              value={bencanaForm.coordinates[0] || ""}
              onChange={(e) =>
                setBencanaForm({
                  ...bencanaForm,
                  coordinates: [
                    parseFloat(e.target.value) || 0,
                    bencanaForm.coordinates[1] || 0,
                  ],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Latitude"
            />
            <input
              type="number"
              step="any"
              value={bencanaForm.coordinates[1] || ""}
              onChange={(e) =>
                setBencanaForm({
                  ...bencanaForm,
                  coordinates: [
                    bencanaForm.coordinates[0] || 0,
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
              onClick={handleUpdateBencana}
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
            onClick={handleSaveBencana}
            disabled={
              isSaving ||
              !bencanaForm.name ||
              !bencanaForm.coordinates.length ||
              !bencanaForm.description ||
              !bencanaForm.icon
            }
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded ${
              isSaving ||
              !bencanaForm.name ||
              !bencanaForm.coordinates.length ||
              !bencanaForm.description ||
              !bencanaForm.icon
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <FaSave className="mr-2" />
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        )}
      </div>

      {/* Maker Data List */}
      {/* <div className="mt-6 border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Data Marker Tersimpan
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {markerData.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Belum ada data bencana tersimpan
            </p>
          ) : (
            markerData.map((bencana, index) => {
              const riskColor =
                riskLevels.find((r) => r.value === bencana.riskLevel)?.color ||
                "green";
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <FaExclamationTriangle
                        className={`text-${riskColor}-600`}
                      />
                      <span className="font-medium truncate">
                        {bencana.name.replace(/\[.*?\]/g, "").trim()}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                        {bencana.type}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">Radius: {bencana.radius}m</span>
                      <span className="mr-2">Risiko: {bencana.riskLevel}</span>
                      <FaClock className="mr-1" />
                      <span>{formatDate(bencana.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleBencanaVisibility(bencana.id)}
                      className={`p-1 rounded ${
                        hiddenBencana.has(bencana.id)
                          ? "text-gray-400 hover:bg-gray-100"
                          : "text-blue-600 hover:bg-blue-100"
                      }`}
                      title={
                        hiddenBencana.has(bencana.id)
                          ? "Tampilkan"
                          : "Sembunyikan"
                      }
                    >
                      <FaEye className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleEditBencana(bencana)}
                      className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                      title="Edit"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDeleteBencana(bencana.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="Hapus"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div> */}
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
                    onBencanaPlace={handleBencanaPlace}
                    onPolygonEdit={handlePolygonEdit}
                    existingData={[
                      ...polygonData.filter((p) => !hiddenPolygons.has(p.id)),
                      ...markerData.filter((m) => !hiddenMarkers.has(m.id)),
                      ...markerData.filter((b) => !hiddenBencana.has(b.id)),
                    ]}
                    selectedColor={selectedColor}
                    editingItem={editingItem}
                    bencanaRadius={bencanaForm.radius}
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
                          const newMode =
                            mapMode === "polygon" ? "view" : "polygon";
                          setMapMode(newMode);
                          if (newMode === "view") {
                            setCurrentCoordinates(null);
                            setPolygonForm((prev) => ({
                              ...prev,
                              coordinates: [],
                              area: 0,
                            }));
                          }
                        }}
                        className={`flex items-center px-3 py-1 text-sm rounded ${
                          mapMode === "polygon"
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <FaPlus className="mr-1" />
                        {mapMode === "polygon" ? "Batal" : "Gambar"}
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

                    {/* Polygon Data List */}
                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Data Polygon Tersimpan
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {polygonData.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">
                            Belum ada polygon tersimpan
                          </p>
                        ) : (
                          polygonData.map((polygon, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: polygon.color }}
                                  />
                                  <span className="font-medium truncate">
                                    {polygon.name}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <FaClock className="mr-1" />
                                  <span>{formatDate(polygon.updatedAt)}</span>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() =>
                                    togglePolygonVisibility(polygon.id)
                                  }
                                  className={`p-1 rounded ${
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
                                  <FaEye className="text-xs" />
                                </button>
                                <button
                                  onClick={() => handleEditPolygon(polygon)}
                                  className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                                  title="Edit"
                                >
                                  <FaEdit className="text-xs" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeletePolygon(polygon.id)
                                  }
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  title="Hapus"
                                >
                                  <FaTrash className="text-xs" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Marker Tab */}
                {activeTab === "marker" && renderMarkerTab()}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-lg shadow bg-white">
          <div className="p-3 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Polygon dan Marker Tersimpan
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
