import { useState, useEffect } from "react";
import {
  FaMapMarkedAlt,
  FaDrawPolygon,
  FaMapPin,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaPalette,
  FaEdit,
  FaSave,
  FaTrash,
  FaEye,
  FaPlus,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { alertError, alertSuccess } from "../../libs/alert";
import ColorPicker from "../ui/ColorPicker";
import EditableMap from "../ui/EditableMap";
import { MapApi } from "../../libs/api/MapApi";

export default function KelolaSIG() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("polygon");
  const [showPanduan, setShowPanduan] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [polygonData, setPolygonData] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [bencanaData, setBencanaData] = useState([]);
  const [mapMode, setMapMode] = useState("view");
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      const response = await MapApi.getAll(i18n.language);
      const result = await response.json();
      
      if (response.ok && result.data) {
        const data = result.data;
        const polygons = data.filter(item => item.type === 'POLYGON').map(item => ({
          ...item,
          type: 'polygon',
          coordinates: JSON.parse(item.coordinates || '[]'),
          color: item.color || '#3B82F6'
        }));
        const markers = data.filter(item => item.type === 'MARKER' && !item.name.includes('[')).map(item => ({
          ...item,
          type: 'marker',
          coordinates: JSON.parse(item.coordinates || '[]')[0],
          color: '#3B82F6'
        }));
        const bencana = data.filter(item => item.type === 'MARKER' && item.name.includes('[')).map(item => ({
          ...item,
          type: 'marker',
          coordinates: JSON.parse(item.coordinates || '[]')[0],
          color: item.description.includes('tinggi') ? '#EF4444' : item.description.includes('sedang') ? '#F59E0B' : '#10B981',
          radius: item.radius || 500
        }));
        
        setPolygonData(polygons);
        setMarkerData(markers);
        setBencanaData(bencana);
      }
    } catch (error) {
      console.error('Error loading map data:', error);
    }
  };

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
    description: "",
    category: "",
    icon: "default",
    lat: 0,
    lng: 0,
  });

  const [bencanaForm, setBencanaForm] = useState({
    name: "",
    type: "",
    description: "",
    riskLevel: "rendah",
    coordinates: [],
    radius: 500,
  });

  // File states
  const [markerIconFile, setMarkerIconFile] = useState(null);
  const [bencanaIconFile, setBencanaIconFile] = useState(null);
  const [markerIconPreview, setMarkerIconPreview] = useState(null);
  const [bencanaIconPreview, setBencanaIconPreview] = useState(null);

  // Kategori data
  const bencanaTypes = [
    "Banjir",
    "Longsor",
    "Gempa",
    "Kebakaran",
    "Kekeringan",
    "Angin Kencang",
    "Lainnya",
  ];

  const markerCategories = [
    "Pemerintahan",
    "Pendidikan",
    "Kesehatan",
    "Fasilitas Umum",
    "Ekonomi",
    "Pariwisata",
    "Lainnya",
  ];

  const riskLevels = [
    { value: "rendah", label: "Rendah", color: "green" },
    { value: "sedang", label: "Sedang", color: "yellow" },
    { value: "tinggi", label: "Tinggi", color: "red" },
  ];

  const colorPresets = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"
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
    {
      id: "bencana",
      name: "Sumber Bencana",
      icon: <FaExclamationTriangle />,
      description: "Kelola area rawan bencana",
    },
  ];

  const panduanContent = {
    polygon: [
      "1. Klik tombol 'Mulai Gambar Polygon' di panel kanan",
      "2. Klik di peta untuk membuat titik pertama",
      "3. Lanjutkan klik untuk membuat titik-titik berikutnya",
      "4. Klik titik pertama lagi untuk menutup polygon",
      "5. Pilih warna dan isi informasi di form",
      "6. Klik 'Simpan' untuk menyimpan polygon",
    ],
    marker: [
      "1. Klik tombol 'Tambah Marker' di panel kanan",
      "2. Klik di peta untuk menempatkan marker",
      "3. Pilih kategori dan icon yang sesuai",
      "4. Isi nama dan deskripsi marker",
      "5. Drag marker untuk mengubah posisi jika perlu",
      "6. Klik 'Simpan' untuk menyimpan marker",
    ],
    bencana: [
      "1. Pilih jenis bencana dari dropdown",
      "2. Tentukan tingkat risiko (Rendah/Sedang/Tinggi)",
      "3. Gambar area atau tempatkan marker sesuai kebutuhan",
      "4. Isi nama dan deskripsi detail bencana",
      "5. Pastikan koordinat sudah sesuai",
      "6. Klik 'Simpan' untuk menyimpan data bencana",
    ],
  };

  // Map event handlers
  const handlePolygonComplete = (coordinates) => {
    setCurrentCoordinates(coordinates);
    const area = calculatePolygonArea(coordinates);
    setPolygonForm(prev => ({
      ...prev,
      coordinates,
      area,
      color: selectedColor
    }));
    setMapMode("view");
    alertSuccess("Polygon berhasil dibuat! Isi form untuk menyimpan.");
  };

  const handleMarkerPlace = (coordinates) => {
    setCurrentCoordinates(coordinates);
    setMarkerForm(prev => ({
      ...prev,
      lat: coordinates.lat,
      lng: coordinates.lng
    }));
    alertSuccess("Marker berhasil ditempatkan! Isi form untuk menyimpan.");
  };

  const handleBencanaPlace = (coordinates) => {
    setCurrentCoordinates(coordinates);
    setBencanaForm(prev => ({
      ...prev,
      coordinates: [coordinates.lat, coordinates.lng]
    }));
    alertSuccess("Lokasi bencana berhasil ditandai! Isi form untuk menyimpan.");
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
      area: calculatePolygonArea(polygon.coordinates)
    });
  };

  const handleEditMarker = (marker) => {
    setEditingItem(marker);
    setMapMode("edit");
    setActiveTab("marker");
    setMarkerForm({
      name: marker.name,
      description: marker.description || "",
      category: marker.category || "",
      icon: marker.icon || "default",
      lat: marker.coordinates[0],
      lng: marker.coordinates[1]
    });
    setMarkerIconFile(null);
    setMarkerIconPreview(null);
  };

  const handleEditBencana = (bencana) => {
    setEditingItem(bencana);
    setMapMode("edit");
    setActiveTab("bencana");
    setBencanaForm({
      name: bencana.name,
      type: bencana.type || "",
      description: bencana.description || "",
      riskLevel: bencana.riskLevel || "rendah",
      coordinates: bencana.coordinates,
      radius: bencana.radius || 500
    });
    setBencanaIconFile(null);
    setBencanaIconPreview(null);
  };

  const handlePolygonEdit = (updatedPolygon) => {
    setPolygonForm(prev => ({
      ...prev,
      coordinates: updatedPolygon.coordinates,
      area: calculatePolygonArea(updatedPolygon.coordinates)
    }));
  };

  const handleUpdatePolygon = async () => {
    if (!editingItem || !polygonForm.name || !polygonForm.description) {
      alertError("Mohon lengkapi semua field");
      return;
    }

    try {
      const payload = {
        type: "POLYGON",
        name: polygonForm.name,
        description: polygonForm.description,
        year: new Date().getFullYear(),
        coordinates: JSON.stringify(polygonForm.coordinates.map(pt => [pt[1], pt[0]])),
        color: polygonForm.color
      };

      const response = await MapApi.update(editingItem.id, payload, i18n.language);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Gagal mengupdate polygon");
      }

      // Reload data from server
      await loadMapData();
      setPolygonForm({ name: "", description: "", color: selectedColor, coordinates: [], area: 0 });
      setEditingItem(null);
      setMapMode("view");
      alertSuccess("Polygon berhasil diupdate!");
    } catch (error) {
      alertError(error.message);
    }
  };

  const handleUpdateMarker = async () => {
    if (!editingItem || !markerForm.name || !markerForm.category) {
      alertError("Mohon lengkapi semua field");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", "MARKER");
      formData.append("name", markerForm.name);
      formData.append("description", `${markerForm.category} - ${markerForm.description}`);
      formData.append("year", new Date().getFullYear());
      formData.append("coordinates", JSON.stringify([[markerForm.lng, markerForm.lat]]));
      if (markerIconFile) {
        formData.append("icon", markerIconFile);
      }
      formData.append("_method", "PUT");

      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/maps/${editingItem.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Accept-Language": i18n.language,
          },
          body: formData,
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Gagal mengupdate marker");
      }

      // Reload data from server
      await loadMapData();
      setMarkerForm({ name: "", description: "", category: "", icon: "default", lat: 0, lng: 0 });
      setMarkerIconFile(null);
      setMarkerIconPreview(null);
      setEditingItem(null);
      setMapMode("view");
      alertSuccess("Marker berhasil diupdate!");
    } catch (error) {
      alertError(error.message);
    }
  };

  const handleUpdateBencana = async () => {
    if (!editingItem || !bencanaForm.name || !bencanaForm.type) {
      alertError("Mohon lengkapi semua field");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", "MARKER");
      formData.append("name", `[${bencanaForm.type}] ${bencanaForm.name}`);
      formData.append("description", `Risiko: ${bencanaForm.riskLevel} - ${bencanaForm.description}`);
      formData.append("year", new Date().getFullYear());
      formData.append("coordinates", JSON.stringify([[bencanaForm.coordinates[1], bencanaForm.coordinates[0]]]));
      formData.append("radius", bencanaForm.radius || 500);
      if (bencanaIconFile) {
        formData.append("icon", bencanaIconFile);
      }
      formData.append("_method", "PUT");

      const response = await fetch(
        `${import.meta.env.VITE_NEW_BASE_URL}/admin/maps/${editingItem.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Accept-Language": i18n.language,
          },
          body: formData,
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Gagal mengupdate data bencana");
      }

      // Reload data from server
      await loadMapData();
      setBencanaForm({ name: "", type: "", description: "", riskLevel: "rendah", coordinates: [], radius: 500 });
      setBencanaIconFile(null);
      setBencanaIconPreview(null);
      setEditingItem(null);
      setMapMode("view");
      alertSuccess("Data bencana berhasil diupdate!");
    } catch (error) {
      alertError(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setMapMode("view");
    setPolygonForm({ name: "", description: "", color: selectedColor, coordinates: [], area: 0 });
    setMarkerForm({ name: "", description: "", category: "", icon: "default", lat: 0, lng: 0 });
    setBencanaForm({ name: "", type: "", description: "", riskLevel: "rendah", coordinates: [], radius: 500 });
    setMarkerIconFile(null);
    setBencanaIconFile(null);
    setMarkerIconPreview(null);
    setBencanaIconPreview(null);
  };

  // File handlers
  const handleMarkerIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMarkerIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setMarkerIconPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBencanaIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBencanaIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setBencanaIconPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeMarkerIcon = () => {
    setMarkerIconFile(null);
    setMarkerIconPreview(null);
  };

  const removeBencanaIcon = () => {
    setBencanaIconFile(null);
    setBencanaIconPreview(null);
  };

  // Delete handlers
  const handleDeletePolygon = async (id) => {
    try {
      const response = await MapApi.delete(id, i18n.language);
      if (response.ok) {
        setPolygonData(prev => prev.filter(item => item.id !== id));
        alertSuccess("Polygon berhasil dihapus!");
      }
    } catch (error) {
      alertError("Gagal menghapus polygon");
    }
  };

  const handleDeleteMarker = async (id) => {
    try {
      const response = await MapApi.delete(id, i18n.language);
      if (response.ok) {
        setMarkerData(prev => prev.filter(item => item.id !== id));
        alertSuccess("Marker berhasil dihapus!");
      }
    } catch (error) {
      alertError("Gagal menghapus marker");
    }
  };

  const handleDeleteBencana = async (id) => {
    try {
      const response = await MapApi.delete(id, i18n.language);
      if (response.ok) {
        setBencanaData(prev => prev.filter(item => item.id !== id));
        alertSuccess("Data bencana berhasil dihapus!");
      }
    } catch (error) {
      alertError("Gagal menghapus data bencana");
    }
  };

  // Save handlers
  const handleSavePolygon = async () => {
    if (!polygonForm.name || !polygonForm.description || !polygonForm.coordinates.length) {
      alertError("Mohon lengkapi semua field dan gambar polygon di peta");
      return;
    }

    try {
      const payload = {
        type: "POLYGON",
        name: polygonForm.name,
        description: polygonForm.description,
        year: new Date().getFullYear(),
        coordinates: JSON.stringify(polygonForm.coordinates.map(pt => [pt[1], pt[0]])),
        color: polygonForm.color
      };

      const response = await MapApi.create(payload, i18n.language);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan polygon");
      }

      // Reload data from server
      await loadMapData();
      setPolygonForm({ name: "", description: "", color: selectedColor, coordinates: [], area: 0 });
      setCurrentCoordinates(null);
      setMapMode("view");
      alertSuccess("Polygon berhasil disimpan!");
    } catch (error) {
      alertError(error.message);
    }
  };

  const handleSaveMarker = async () => {
    if (!markerForm.name || !markerForm.category || !markerForm.lat || !markerForm.lng) {
      alertError("Mohon lengkapi semua field dan pilih lokasi di peta");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", "MARKER");
      formData.append("name", markerForm.name);
      formData.append("description", `${markerForm.category} - ${markerForm.description}`);
      formData.append("year", new Date().getFullYear());
      formData.append("coordinates", JSON.stringify([[markerForm.lng, markerForm.lat]]));
      if (markerIconFile) {
        formData.append("icon", markerIconFile);
      }

      const response = await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/maps`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Accept-Language": i18n.language,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan marker");
      }

      // Reload data from server
      await loadMapData();
      setMarkerForm({ name: "", description: "", category: "", icon: "default", lat: 0, lng: 0 });
      setMarkerIconFile(null);
      setMarkerIconPreview(null);
      setCurrentCoordinates(null);
      setMapMode("view");
      alertSuccess("Marker berhasil disimpan!");
    } catch (error) {
      alertError(error.message);
    }
  };

  const handleSaveBencana = async () => {
    if (!bencanaForm.name || !bencanaForm.type || !bencanaForm.coordinates.length) {
      alertError("Mohon lengkapi semua field dan pilih lokasi di peta");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", "MARKER");
      formData.append("name", `[${bencanaForm.type}] ${bencanaForm.name}`);
      formData.append("description", `Risiko: ${bencanaForm.riskLevel} - ${bencanaForm.description}`);
      formData.append("year", new Date().getFullYear());
      formData.append("coordinates", JSON.stringify([[bencanaForm.coordinates[1], bencanaForm.coordinates[0]]]));
      formData.append("radius", bencanaForm.radius || 500);
      if (bencanaIconFile) {
        formData.append("icon", bencanaIconFile);
      }

      const response = await fetch(`${import.meta.env.VITE_NEW_BASE_URL}/admin/maps`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Accept-Language": i18n.language,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data bencana");
      }

      // Reload data from server
      await loadMapData();
      setBencanaForm({ name: "", type: "", description: "", riskLevel: "rendah", coordinates: [], radius: 500 });
      setBencanaIconFile(null);
      setBencanaIconPreview(null);
      setCurrentCoordinates(null);
      setMapMode("view");
      alertSuccess("Data bencana berhasil disimpan!");
    } catch (error) {
      alertError(error.message);
    }
  };

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
            
            {/* Panduan Singkat */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                <FaDrawPolygon className="text-blue-600 mr-2" />
                <div className="text-xs">
                  <span className="font-medium text-blue-900">Polygon:</span>
                  <span className="text-blue-700 ml-1">Gambar → Klik peta → Simpan</span>
                </div>
              </div>
              
              <div className="flex items-center p-2 bg-green-50 rounded-lg border border-green-200">
                <FaMapPin className="text-green-600 mr-2" />
                <div className="text-xs">
                  <span className="font-medium text-green-900">Marker:</span>
                  <span className="text-green-700 ml-1">Tambah → Klik peta → Simpan</span>
                </div>
              </div>
              
              <div className="flex items-center p-2 bg-red-50 rounded-lg border border-red-200">
                <FaExclamationTriangle className="text-red-600 mr-2" />
                <div className="text-xs">
                  <span className="font-medium text-red-900">Bencana:</span>
                  <span className="text-red-700 ml-1">Pilih jenis → Klik peta → Simpan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Map Area */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Peta Interaktif</h2>
                <p className="text-sm text-gray-500">
                  Klik dan drag untuk mengelola data geografis
                </p>
              </div>
              <div className="p-3">
                {/* Editable Map */}
                <div className="h-96 md:h-[500px]">
                  <EditableMap
                    mode={mapMode}
                    onPolygonComplete={handlePolygonComplete}
                    onMarkerPlace={handleMarkerPlace}
                    onBencanaPlace={handleBencanaPlace}
                    onPolygonEdit={handlePolygonEdit}
                    existingData={[...polygonData, ...markerData, ...bencanaData]}
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
                        onClick={() => setMapMode(mapMode === "polygon" ? "view" : "polygon")}
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

                    {/* Mini Panduan */}
                    <div className="p-2 bg-blue-50 rounded text-xs text-blue-700 border border-blue-200">
                      <span className="font-medium">Cara:</span> Klik "Gambar" → Klik di peta untuk buat titik → Pilih warna → Isi form → Simpan
                    </div>

                    {/* Color Picker */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Warna Polygon
                      </label>
                      <ColorPicker
                        value={selectedColor}
                        onChange={setSelectedColor}
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
                          onChange={(e) => setPolygonForm({...polygonForm, name: e.target.value})}
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
                          onChange={(e) => setPolygonForm({...polygonForm, description: e.target.value})}
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
                          value={polygonForm.area ? `${polygonForm.area} m²` : "Akan dihitung otomatis"}
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Polygon Action Buttons */}
                    <div className="flex space-x-2">
                      {editingItem ? (
                        <>
                          <button 
                            onClick={handleUpdatePolygon}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            <FaSave className="mr-2" />
                            Update
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
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <FaSave className="mr-2" />
                          Simpan
                        </button>
                      )}
                    </div>

                    {/* Polygon Data List */}
                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Data Polygon Tersimpan</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {polygonData.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">Belum ada polygon tersimpan</p>
                        ) : (
                          polygonData.map((polygon, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: polygon.color }}
                                />
                                <span className="font-medium">{polygon.name}</span>
                              </div>
                              <div className="flex space-x-1">
                                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                  <FaEye className="text-xs" />
                                </button>
                                <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded">
                                  <FaEdit className="text-xs" />
                                </button>
                                <button 
                                  onClick={() => handleDeletePolygon(polygon.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
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
                {activeTab === "marker" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Kelola Marker</h3>
                      <button 
                        onClick={() => setMapMode(mapMode === "marker" ? "view" : "marker")}
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

                    {/* Mini Panduan */}
                    <div className="p-2 bg-green-50 rounded text-xs text-green-700 border border-green-200">
                      <span className="font-medium">Cara:</span> Klik "Tambah" → Klik di peta → Drag untuk pindah → Isi form → Simpan
                    </div>

                    {/* Marker Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kategori
                        </label>
                        <select
                          value={markerForm.category}
                          onChange={(e) => setMarkerForm({...markerForm, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Pilih Kategori</option>
                          {markerCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lokasi
                        </label>
                        <input
                          type="text"
                          value={markerForm.name}
                          onChange={(e) => setMarkerForm({...markerForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nama lokasi"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deskripsi
                        </label>
                        <textarea
                          value={markerForm.description}
                          onChange={(e) => setMarkerForm({...markerForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                          placeholder="Deskripsi lokasi"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon Marker
                        </label>
                        <div className="space-y-2">
                          {markerIconPreview ? (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                              <img 
                                src={markerIconPreview} 
                                alt="Preview" 
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">Icon dipilih</p>
                                <p className="text-xs text-gray-500">{markerIconFile?.name}</p>
                              </div>
                              <button
                                type="button"
                                onClick={removeMarkerIcon}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                <FaPlus className="w-4 h-4 mb-1 text-gray-500" />
                                <p className="text-xs text-gray-500">Upload Icon</p>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleMarkerIconChange}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titik Koordinat
                        </label>
                        <input
                          type="text"
                          value={markerForm.lat && markerForm.lng ? `${markerForm.lat.toFixed(6)}, ${markerForm.lng.toFixed(6)}` : "Klik di peta untuk menentukan lokasi"}
                          readOnly
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600"
                          placeholder="Koordinat akan muncul setelah klik di peta"
                        />
                      </div>
                    </div>

                    {/* Marker Action Buttons */}
                    <div className="flex space-x-2">
                      {editingItem ? (
                        <>
                          <button 
                            onClick={handleUpdateMarker}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            <FaSave className="mr-2" />
                            Update
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
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <FaSave className="mr-2" />
                          Simpan
                        </button>
                      )}
                    </div>

                    {/* Marker Data List */}
                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Marker Tersimpan</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {markerData.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">Belum ada marker tersimpan</p>
                        ) : (
                          markerData.map((marker, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                              <div>
                                <div className="font-medium">{marker.name}</div>
                                <div className="text-xs text-gray-500">{marker.category}</div>
                              </div>
                              <div className="flex space-x-1">
                                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                  <FaEye className="text-xs" />
                                </button>
                                <button 
                                  onClick={() => handleEditMarker(marker)}
                                  className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                                >
                                  <FaEdit className="text-xs" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteMarker(marker.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
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

                {/* Bencana Tab */}
                {activeTab === "bencana" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Sumber Bencana</h3>
                      <button 
                        onClick={() => setMapMode(mapMode === "bencana" ? "view" : "bencana")}
                        className={`flex items-center px-3 py-1 text-sm rounded ${
                          mapMode === "bencana" 
                            ? "bg-gray-600 text-white hover:bg-gray-700" 
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        <FaPlus className="mr-1" />
                        {mapMode === "bencana" ? "Batal" : "Tambah"}
                      </button>
                    </div>

                    {/* Mini Panduan */}
                    <div className="p-2 bg-red-50 rounded text-xs text-red-700 border border-red-200">
                      <span className="font-medium">Cara:</span> Pilih jenis bencana → Klik "Tambah" → Klik di peta → Isi detail → Simpan
                    </div>

                    {/* Bencana Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Bencana
                        </label>
                        <select
                          value={bencanaForm.type}
                          onChange={(e) => setBencanaForm({...bencanaForm, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Pilih Jenis Bencana</option>
                          {bencanaTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tingkat Risiko
                        </label>
                        <select
                          value={bencanaForm.riskLevel}
                          onChange={(e) => setBencanaForm({...bencanaForm, riskLevel: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {riskLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Area/Lokasi
                        </label>
                        <input
                          type="text"
                          value={bencanaForm.name}
                          onChange={(e) => setBencanaForm({...bencanaForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nama area rawan bencana"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Radius Bahaya (meter)
                        </label>
                        <input
                          type="number"
                          value={bencanaForm.radius}
                          onChange={(e) => {
                            const value = e.target.value;
                            setBencanaForm({...bencanaForm, radius: value === '' ? '' : parseInt(value) || ''});
                          }}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value) || value < 100) {
                              setBencanaForm({...bencanaForm, radius: 500});
                            } else if (value > 5000) {
                              setBencanaForm({...bencanaForm, radius: 5000});
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="500"
                          min="100"
                          max="5000"
                          step="100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Area lingkaran bahaya dalam meter (100-5000m)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon Bencana
                        </label>
                        <div className="space-y-2">
                          {bencanaIconPreview ? (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                              <img 
                                src={bencanaIconPreview} 
                                alt="Preview" 
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">Icon dipilih</p>
                                <p className="text-xs text-gray-500">{bencanaIconFile?.name}</p>
                              </div>
                              <button
                                type="button"
                                onClick={removeBencanaIcon}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                <FaPlus className="w-4 h-4 mb-1 text-gray-500" />
                                <p className="text-xs text-gray-500">Upload Icon</p>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleBencanaIconChange}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deskripsi Detail
                        </label>
                        <textarea
                          value={bencanaForm.description}
                          onChange={(e) => setBencanaForm({...bencanaForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                          placeholder="Deskripsi detail tentang potensi bencana, dampak, dan langkah mitigasi"
                        />
                      </div>
                    </div>

                    {/* Risk Level Indicator */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Indikator Risiko:</span>
                        <div className="flex space-x-2">
                          {riskLevels.map((level) => (
                            <div key={level.value} className="flex items-center">
                              <div 
                                className={`w-3 h-3 rounded-full mr-1 bg-${level.color}-500`}
                              />
                              <span className="text-xs">{level.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bencana Action Buttons */}
                    <div className="flex space-x-2">
                      {editingItem ? (
                        <>
                          <button 
                            onClick={handleUpdateBencana}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            <FaSave className="mr-2" />
                            Update
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
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <FaSave className="mr-2" />
                          Simpan
                        </button>
                      )}
                    </div>

                    {/* Bencana Data List */}
                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Sumber Bencana Tersimpan</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {bencanaData.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">Belum ada data bencana tersimpan</p>
                        ) : (
                          bencanaData.map((bencana, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                              <div>
                                <div className="font-medium">{bencana.name}</div>
                                <div className="flex items-center space-x-2 text-xs">
                                  <span className="text-gray-500">{bencana.type}</span>
                                  <span className={`px-2 py-0.5 rounded text-white ${
                                    bencana.riskLevel === 'tinggi' ? 'bg-red-500' :
                                    bencana.riskLevel === 'sedang' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}>
                                    {bencana.riskLevel}
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                  <FaEye className="text-xs" />
                                </button>
                                <button 
                                  onClick={() => handleEditBencana(bencana)}
                                  className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                                >
                                  <FaEdit className="text-xs" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteBencana(bencana.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
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


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}