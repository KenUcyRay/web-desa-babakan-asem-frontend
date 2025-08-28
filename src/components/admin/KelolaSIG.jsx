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
  const [bencanaData, setBencanaData] = useState([]);
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

  // Data constants
  const bencanaTypes = ["Banjir", "Longsor", "Gempa", "Kebakaran", "Kekeringan", "Angin Kencang", "Lainnya"];
  const markerCategories = ["Pemerintahan", "Pendidikan", "Kesehatan", "Fasilitas Umum", "Ekonomi", "Pariwisata", "Lainnya"];
  const riskLevels = [
    { value: "rendah", label: "Rendah", color: "green" },
    { value: "sedang", label: "Sedang", color: "yellow" },
    { value: "tinggi", label: "Tinggi", color: "red" },
  ];
  const colorPresets = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];

  const tabs = [
    { id: "polygon", name: "Polygon", icon: <FaDrawPolygon />, description: "Kelola area dan wilayah" },
    { id: "marker", name: "Marker", icon: <FaMapPin />, description: "Kelola titik lokasi" },
    { id: "bencana", name: "Sumber Bencana", icon: <FaExclamationTriangle />, description: "Kelola area rawan bencana" },
  ];

  // Load data on mount
  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      const response = await MapApi.getAll(i18n.language);
      if (!response.ok) return;
      
      const result = await response.json();
      if (result.data) {
        const data = result.data;
        
        const polygons = data.filter(item => item.type === 'POLYGON').map(item => {
          let coordinates = [];
          try {
            coordinates = typeof item.coordinates === 'string' ? JSON.parse(item.coordinates) : item.coordinates;
          } catch (e) {
            coordinates = [];
          }
          return { ...item, type: 'polygon', coordinates, color: item.color || '#3B82F6' };
        });
        
        const markers = data.filter(item => item.type === 'MARKER' && !item.name.includes('[')).map(item => {
          const coords = typeof item.coordinates === 'string' ? JSON.parse(item.coordinates) : item.coordinates;
          return { ...item, type: 'marker', coordinates: Array.isArray(coords) ? coords[0] : coords, color: item.color || '#3B82F6' };
        });
        
        const bencana = data.filter(item => item.type === 'MARKER' && item.name.includes('[')).map(item => {
          let color = '#10B981';
          if (item.description && item.description.includes('tinggi')) color = '#EF4444';
          else if (item.description && item.description.includes('sedang')) color = '#F59E0B';
          
          const coords = typeof item.coordinates === 'string' ? JSON.parse(item.coordinates) : item.coordinates;
          return {
            ...item,
            type: 'marker',
            coordinates: Array.isArray(coords) ? coords[0] : coords,
            color: item.color || color,
            radius: item.radius || 500,
            riskLevel: item.description && item.description.includes('tinggi') ? 'tinggi' : 
                      item.description && item.description.includes('sedang') ? 'sedang' : 'rendah'
          };
        });
        
        setPolygonData(polygons);
        setMarkerData(markers);
        setBencanaData(bencana);
      }
    } catch (error) {
      console.error('Error loading map data:', error);
    }
  };

  // Map event handlers
  const handlePolygonComplete = (coordinates) => {
    if (currentCoordinates && JSON.stringify(currentCoordinates) === JSON.stringify(coordinates)) return;
    
    setCurrentCoordinates(coordinates);
    const area = calculatePolygonArea(coordinates);
    setPolygonForm(prev => ({ ...prev, coordinates, area, color: prev.color || selectedColor }));
    setMapMode("view");
    alertSuccess("Polygon berhasil dibuat! Isi form untuk menyimpan.");
  };

  const handleMarkerPlace = (coordinates) => {
    setCurrentCoordinates(coordinates);
    setMarkerForm(prev => ({ ...prev, lat: coordinates.lat, lng: coordinates.lng }));
    alertSuccess("Marker berhasil ditempatkan! Isi form untuk menyimpan.");
  };

  const handleBencanaPlace = (coordinates) => {
    setCurrentCoordinates(coordinates);
    setBencanaForm(prev => ({ ...prev, coordinates: [coordinates.lat, coordinates.lng] }));
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

  const handlePolygonEdit = (updatedPolygon) => {
    setPolygonForm(prev => ({
      ...prev,
      coordinates: updatedPolygon.coordinates,
      area: calculatePolygonArea(updatedPolygon.coordinates)
    }));
  };

  // Save handlers
  const handleSavePolygon = async () => {
    if (isSaving) return;
    if (!polygonForm.name || !polygonForm.description || !polygonForm.coordinates.length) {
      alertError("Mohon lengkapi semua field dan gambar polygon di peta");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        type: "POLYGON",
        name: polygonForm.name,
        description: polygonForm.description,
        year: new Date().getFullYear(),
        coordinates: JSON.stringify(polygonForm.coordinates),
        color: polygonForm.color
      };
      
      const response = await MapApi.create(payload, i18n.language);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan polygon");
      }

      setPolygonForm({ name: "", description: "", color: "#3B82F6", coordinates: [], area: 0 });
      setSelectedColor("#3B82F6");
      setCurrentCoordinates(null);
      setMapMode("view");
      await loadMapData();
      alertSuccess("Polygon berhasil disimpan!");
    } catch (error) {
      alertError(error.message || 'Terjadi kesalahan saat menyimpan polygon');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePolygon = async () => {
    if (!editingItem || !polygonForm.name || !polygonForm.description || !polygonForm.coordinates.length) {
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
        coordinates: JSON.stringify(polygonForm.coordinates),
        color: polygonForm.color
      };
      
      console.log('Attempting update for ID:', editingItem.id);
      const response = await MapApi.update(editingItem.id, payload, i18n.language);
      
      // Handle 404 - use delete + create fallback
      if (response.status === 404) {
        console.log('PUT endpoint not found, using delete + create fallback');
        
        // Delete old polygon
        await MapApi.delete(editingItem.id, i18n.language);
        
        // Create new polygon with updated data
        const createResponse = await MapApi.create(payload, i18n.language);
        const createResult = await createResponse.json();
        
        if (!createResponse.ok) {
          throw new Error(createResult.message || "Gagal mengupdate polygon");
        }
      } else {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Gagal mengupdate polygon");
        }
      }

      setPolygonForm({ name: "", description: "", color: "#3B82F6", coordinates: [], area: 0 });
      setSelectedColor("#3B82F6");
      setCurrentCoordinates(null);
      setEditingItem(null);
      setMapMode("view");
      await loadMapData();
      alertSuccess("Polygon berhasil diupdate!");
    } catch (error) {
      console.error('Update error:', error);
      alertError(error.message || 'Terjadi kesalahan saat mengupdate polygon');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handlers
  const handleDeletePolygon = async (id) => {
    try {
      const response = await MapApi.delete(id, i18n.language);
      if (response.ok) {
        if (editingItem && editingItem.id === id) {
          setEditingItem(null);
          setMapMode("view");
          setPolygonForm({ name: "", description: "", color: "#3B82F6", coordinates: [], area: 0 });
          setSelectedColor("#3B82F6");
        }
        await loadMapData();
        alertSuccess("Polygon berhasil dihapus!");
      }
    } catch (error) {
      alertError("Gagal menghapus polygon");
    }
  };

  // Visibility handlers
  const togglePolygonVisibility = (id) => {
    setHiddenPolygons(prev => {
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
    setPolygonForm({ name: "", description: "", color: "#3B82F6", coordinates: [], area: 0 });
    setSelectedColor("#3B82F6");
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
                <div className="h-96 md:h-[500px]">
                  <EditableMap
                    mode={mapMode}
                    onPolygonComplete={handlePolygonComplete}
                    onMarkerPlace={handleMarkerPlace}
                    onBencanaPlace={handleBencanaPlace}
                    onPolygonEdit={handlePolygonEdit}
                    existingData={[
                      ...polygonData.filter(p => !hiddenPolygons.has(p.id)), 
                      ...markerData.filter(m => !hiddenMarkers.has(m.id)), 
                      ...bencanaData.filter(b => !hiddenBencana.has(b.id))
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
                          const newMode = mapMode === "polygon" ? "view" : "polygon";
                          setMapMode(newMode);
                          if (newMode === "view") {
                            setCurrentCoordinates(null);
                            setPolygonForm(prev => ({ ...prev, coordinates: [], area: 0 }));
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
                          setPolygonForm({...polygonForm, color});
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
                          value={polygonForm.area ? `${polygonForm.area.toFixed(2)} m²` : "Akan dihitung otomatis"}
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
                          disabled={isSaving || !polygonForm.name || !polygonForm.description || !polygonForm.coordinates.length}
                          className={`flex-1 flex items-center justify-center px-4 py-2 rounded ${
                            isSaving || !polygonForm.name || !polygonForm.description || !polygonForm.coordinates.length
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
                                <button 
                                  onClick={() => togglePolygonVisibility(polygon.id)}
                                  className={`p-1 rounded ${
                                    hiddenPolygons.has(polygon.id) 
                                      ? "text-gray-400 hover:bg-gray-100" 
                                      : "text-blue-600 hover:bg-blue-100"
                                  }`}
                                  title={hiddenPolygons.has(polygon.id) ? "Tampilkan" : "Sembunyikan"}
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
                                  onClick={() => handleDeletePolygon(polygon.id)}
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

                {/* Marker Tab - Placeholder */}
                {activeTab === "marker" && (
                  <div className="text-center py-8">
                    <FaMapPin className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500">Fitur Marker akan segera tersedia</p>
                  </div>
                )}

                {/* Bencana Tab - Placeholder */}
                {activeTab === "bencana" && (
                  <div className="text-center py-8">
                    <FaExclamationTriangle className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500">Fitur Sumber Bencana akan segera tersedia</p>
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