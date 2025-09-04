import { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaExclamationTriangle, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { alertError } from "../../libs/alert";
import { MapApi } from "../../libs/api/MapApi";
import UserMap from "../ui/UserMap";

export default function SigDesa() {
  const { i18n } = useTranslation();
  const [mapData, setMapData] = useState({
    polygons: [],
    markers: [],
    bencana: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeLegend, setActiveLegend] = useState("all");
  const [showPolygons, setShowPolygons] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  // Load data from API
  useEffect(() => {
    const loadMapData = async () => {
      try {
        setIsLoading(true);
        const result = await MapApi.getAll(i18n.language);
        
        if (result.data) {
          const data = result.data;
          
          // Process polygons
          const polygons = data.filter(item => item.type === 'POLYGON').map(item => {
            let coordinates = [];
            try {
              coordinates = typeof item.coordinates === 'string' ? JSON.parse(item.coordinates) : item.coordinates;
            } catch (e) {
              coordinates = [];
            }
            return { 
              ...item, 
              type: 'polygon', 
              coordinates, 
              color: item.color || '#3B82F6'
            };
          });
          
          // Process markers
          const markers = data.filter(item => item.type === 'MARKER' && !item.name.includes('[')).map(item => {
            let coords = [];
            try {
              coords = typeof item.coordinates === 'string' ? JSON.parse(item.coordinates) : item.coordinates;
            } catch (e) {
              coords = [];
            }
            
            let coordinate = Array.isArray(coords) && coords.length > 0 ? coords[0] : { lat: 0, lng: 0 };
            if (Array.isArray(coordinate) && coordinate.length === 2) {
              coordinate = { lat: coordinate[0], lng: coordinate[1] };
            }
            
            return { 
              ...item, 
              type: 'marker', 
              coordinates: coordinate, 
              color: item.color || '#3B82F6'
            };
          });
          
          // Process bencana
          const bencana = data.filter(item => item.type === 'BENCANA' || (item.type === 'MARKER' && item.name.includes('['))).map(item => {
            let color = '#10B981';
            if (item.description && item.description.includes('tinggi')) color = '#EF4444';
            else if (item.description && item.description.includes('sedang')) color = '#F59E0B';
            
            let coords = [];
            try {
              coords = typeof item.coordinates === 'string' ? JSON.parse(item.coordinates) : item.coordinates;
            } catch (e) {
              coords = [];
            }
            
            let coordinate = Array.isArray(coords) && coords.length > 0 ? coords[0] : { lat: 0, lng: 0 };
            if (Array.isArray(coordinate) && coordinate.length === 2) {
              coordinate = { lat: coordinate[0], lng: coordinate[1] };
            }
            
            return {
              ...item,
              type: 'bencana',
              coordinates: coordinate,
              color: item.color || color,
              radius: item.radius || 500,
              riskLevel: item.description && item.description.includes('tinggi') ? 'tinggi' : 
                        item.description && item.description.includes('sedang') ? 'sedang' : 'rendah'
            };
          });
          
          setMapData({
            polygons,
            markers,
            bencana
          });
        }
      } catch (error) {
        console.error('Error loading map data:', error);
        alertError('Gagal memuat data peta');
      } finally {
        setIsLoading(false);
      }
    };

    loadMapData();
  }, [i18n.language]);

  // Legend categories
  const legendCategories = [
    {
      id: "all",
      name: "Semua",
      icon: <FaMapMarkedAlt className="text-green-500" />,
      color: "bg-green-100 text-green-800"
    },
    {
      id: "polygon",
      name: "Area",
      icon: <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-200"></div>,
      color: "bg-green-100 text-green-800"
    },
    {
      id: "marker",
      name: "Lokasi",
      icon: <FaMapMarkerAlt className="text-green-500" />,
      color: "bg-green-100 text-green-800"
    }
  ];

  // Risk level colors for bencana
  const riskLevels = [
    { value: "rendah", label: "Rendah", color: "bg-green-500" },
    { value: "sedang", label: "Sedang", color: "bg-yellow-500" },
    { value: "tinggi", label: "Tinggi", color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
            <span className="text-green-600">🗺️ Peta Desa</span> Babakan Asem
          </h1>
          <p className="text-green-600 max-w-2xl mx-auto">
            Lihat informasi geografis desa kami, termasuk area penting, fasilitas umum, dan zona rawan bencana
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Container */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-green-700">Peta Interaktif Desa</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <FaInfoCircle className="mr-1" />
                  <span>Zoom dan geser untuk menjelajahi</span>
                </div>
              </div>
              
              <div className="relative">
                <UserMap showPolygons={showPolygons} showMarkers={showMarkers} />
                
                {/* Map overlay info */}
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg shadow px-3 py-2 z-10">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">{mapData.polygons.length} Area</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">{mapData.markers.length} Lokasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend and Information Panel */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg sticky top-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-green-700">Legenda Peta</h2>
                <p className="text-sm text-green-600">Filter informasi yang ditampilkan</p>
              </div>
              
              <div className="p-4">
                {/* Filter buttons */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {legendCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveLegend(category.id);
                        if (category.id === "all") {
                          setShowPolygons(true);
                          setShowMarkers(true);
                        } else if (category.id === "polygon") {
                          setShowPolygons(true);
                          setShowMarkers(false);
                        } else if (category.id === "marker") {
                          setShowPolygons(false);
                          setShowMarkers(true);
                        }
                      }}
                      className={`flex items-center justify-center p-2 rounded-lg border transition-colors ${
                        activeLegend === category.id
                          ? `${category.color} border-transparent font-medium`
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>
                
                {/* Polygon Legend */}
                <div className="mb-6">
                  <h3 className="font-medium text-green-700 mb-3 flex items-center">
                    <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-200 mr-2"></div>
                    Area dan Zona
                  </h3>
                  <div className="space-y-2">
                    {mapData.polygons.slice(0, 5).map((polygon, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div 
                          className="w-3 h-3 rounded mr-2 border"
                          style={{ backgroundColor: polygon.color }}
                        ></div>
                        <span className="truncate">{polygon.name}</span>
                      </div>
                    ))}
                    {mapData.polygons.length > 5 && (
                      <div className="text-xs text-gray-500 mt-1">
                        +{mapData.polygons.length - 5} area lainnya
                      </div>
                    )}
                    {mapData.polygons.length === 0 && (
                      <div className="text-sm text-gray-500">Tidak ada area terdaftar</div>
                    )}
                  </div>
                </div>
                
                {/* Marker Legend */}
                <div className="mb-6">
                  <h3 className="font-medium text-green-700 mb-3 flex items-center">
                    <FaMapMarkerAlt className="text-green-500 mr-2" />
                    Lokasi Penting
                  </h3>
                  <div className="space-y-2">
                    {mapData.markers.slice(0, 5).map((marker, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <FaMapMarkerAlt className="text-green-500 mr-2" />
                        <span className="truncate">{marker.name}</span>
                      </div>
                    ))}
                    {mapData.markers.length > 5 && (
                      <div className="text-xs text-gray-500 mt-1">
                        +{mapData.markers.length - 5} lokasi lainnya
                      </div>
                    )}
                    {mapData.markers.length === 0 && (
                      <div className="text-sm text-gray-500">Tidak ada lokasi terdaftar</div>
                    )}
                  </div>
                </div>
                

              </div>
              
              {/* Footer */}
              <div className="p-4 border-t bg-green-50 rounded-b-xl">
                <div className="text-xs text-green-600">
                  <p>Peta ini diperbarui secara berkala</p>
                  <p>© {new Date().getFullYear()} Desa Babakan Asem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Information Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Informasi Peta Desa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaMapMarkedAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-green-700 mb-2">Zona dan Area</h3>
              <p className="text-sm text-green-600">
                Tampilkan pembagian wilayah desa, area pertanian, pemukiman, dan zona khusus lainnya.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaMapMarkerAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-green-700 mb-2">Fasilitas Umum</h3>
              <p className="text-sm text-green-600">
                Temukan lokasi fasilitas penting seperti sekolah, puskesmas, pasar, dan tempat ibadah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}