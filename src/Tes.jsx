import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import { useState, useEffect, useMemo } from "react";
import { MapApi } from "./libs/api/MapApi"; // Pastikan path sesuai

// ==== ICON CUSTOM ====
const createIcon = (iconUrl) =>
  L.icon({
    iconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

// Logo/Icon Desa Babakan Asem untuk default marker
// Ganti URL ini dengan URL logo resmi Desa Babakan Asem
const defaultIconUrl = "/assets/icons/logo-desa-babakan-asem.png";
// Fallback jika logo utama gagal dimuat
const fallbackIconUrl = "https://i.ibb.co/XZQQgFP/building.png";

// Default icon dengan logo desa

// Kamus icon berdasarkan kategori
const categoryIcons = {
  office: "/assets/icons/office.png",
  mosque: "/assets/icons/mosque.png",
  school: "/assets/icons/school.png",
  health: "/assets/icons/health.png",
  market: "/assets/icons/market.png",
  default: defaultIconUrl,
};

// Palet warna untuk polygon (tidak boleh sama)
const polygonColors = [
  "#dc2626", // merah
  "#2563eb", // biru
  "#059669", // hijau
  "#f59e42", // oranye
  "#a21caf", // ungu
  "#eab308", // kuning
  "#0ea5e9", // cyan
  "#f43f5e", // pink
];

// Fungsi untuk mendapatkan warna unik berdasarkan kategori polygon
// Assign colors by order of appearance for guaranteed uniqueness
function getPolygonColorByIndex(index) {
  return polygonColors[index % polygonColors.length];
}

export default function Tes() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iconError, setIconError] = useState(false);

  // Handle icon error dengan menggunakan fallback icon
  useEffect(() => {
    const img = new Image();
    img.onerror = () => {
      console.warn("Default icon failed to load, using fallback");
      setIconError(true);
    };
    img.src = defaultIconUrl;
  }, []);

  // Fungsi untuk mengambil data peta dari API
  const fetchMapData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Menggunakan language default 'id' atau bisa disesuaikan
      const response = await MapApi.getMapData("id");

      if (!response.ok) {
        throw new Error("Gagal mengambil data peta");
      }

      const data = await response.json();

      // Format data untuk peta
      const formattedData = [];

      // Menangani region/polygon
      if (data.regions && Array.isArray(data.regions)) {
        data.regions.forEach((region) => {
          formattedData.push({
            id: region.id,
            name: region.name,
            description: region.description || "Wilayah Desa",
            type: "polygon",
            category: region.type || "region", // Kategori untuk legenda
            year: region.year || 2025,
            // Pastikan koordinat dalam format yang benar
            coordinates: region.coordinates,
          });
        });
      }

      // Menangani POI/marker
      if (data.regions && Array.isArray(data.regions)) {
        // POI yang ada di dalam region
        data.regions.forEach((region) => {
          if (region.pois && Array.isArray(region.pois)) {
            region.pois.forEach((poi) => {
              formattedData.push({
                id: `poi-${poi.id}`,
                name: poi.name,
                description: poi.description || "Point of Interest",
                type: "marker",
                category: poi.type || "default", // Kategori untuk legenda
                year: poi.year || 2025,
                coordinates: [poi.coordinates[0]], // Format untuk marker
                icon: getIconForCategory(poi.type, poi.icon),
              });
            });
          }
        });
      }

      // Menangani POI yang berdiri sendiri
      if (data.additionalPois && Array.isArray(data.additionalPois)) {
        data.additionalPois.forEach((poi) => {
          formattedData.push({
            id: `standalone-poi-${poi.id}`,
            name: poi.name,
            description: poi.description || "Point of Interest",
            type: "marker",
            category: poi.type || "default", // Kategori untuk legenda
            year: poi.year || 2025,
            coordinates: [poi.coordinates[0]], // Format untuk marker
            icon: getIconForCategory(poi.type, poi.icon),
          });
        });
      }

      setMapData(formattedData);
    } catch (error) {
      console.error("Error fetching map data:", error);
      setError("Gagal memuat data peta. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mendapatkan icon berdasarkan kategori
  function getIconForCategory(category, customIcon) {
    if (customIcon) return customIcon;

    if (category && categoryIcons[category]) {
      return categoryIcons[category];
    }

    return iconError ? fallbackIconUrl : defaultIconUrl;
  }

  // Mengambil data saat komponen dimuat atau tahun berubah
  useEffect(() => {
    fetchMapData();
  }, [selectedYear]); // Reload data saat tahun berubah

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

  // Buat legendItems untuk marker
  const legendItems = useMemo(() => {
    if (!filteredData.length) return [];
    const legendMap = new Map();
    filteredData
      .filter((item) => item.type === "marker")
      .forEach((marker) => {
        const category = marker.category || "default";
        const icon =
          marker.icon || (iconError ? fallbackIconUrl : defaultIconUrl);
        if (!legendMap.has(`marker-${category}`)) {
          legendMap.set(`marker-${category}`, {
            type: "marker",
            category,
            label: markerCategoryLabel(category),
            icon,
            items: [marker.name],
          });
        } else {
          const entry = legendMap.get(`marker-${category}`);
          if (!entry.items.includes(marker.name)) entry.items.push(marker.name);
        }
      });
    return Array.from(legendMap.values());
  }, [filteredData, iconError]);

  // Fungsi untuk mendapatkan label kategori marker
  function markerCategoryLabel(category) {
    const labelMap = {
      office: "Kantor Desa",
      mosque: "Masjid",
      school: "Sekolah",
      health: "Fasilitas Kesehatan",
      market: "Pasar",
      default: "Point of Interest",
    };
    return labelMap[category] || category;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header dengan Logo */}
      <div className="flex items-center px-5 py-2 bg-white border-b border-gray-300">
        <img
          src={iconError ? fallbackIconUrl : defaultIconUrl}
          alt="Logo Desa Babakan Asem"
          className="h-10 mr-4"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackIconUrl;
          }}
        />
        <h1 className="m-0 text-lg text-gray-800 font-bold">
          Peta Desa Babakan Asem
        </h1>
      </div>

      {/* Filter Tahun */}
      <div className="px-5 py-3 bg-gray-100 border-b border-gray-300 flex items-center">
        <label className="font-bold mr-3 text-sm">Pilih Tahun:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring focus:border-blue-400"
        >
          {[2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Status Indikator */}
        {loading && (
          <span className="ml-4 text-gray-500 text-sm">Memuat data...</span>
        )}
        {error && <span className="ml-4 text-red-600 text-sm">{error}</span>}
      </div>

      {/* Map */}
      <div className="relative w-full" style={{ height: "70vh" }}>
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-50">
            <div className="p-5 bg-white rounded-lg shadow-md flex items-center">
              <img
                src={iconError ? fallbackIconUrl : defaultIconUrl}
                alt="Loading"
                className="h-8 mr-2 align-middle"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackIconUrl;
                }}
              />
              <span>Memuat data peta...</span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 bg-white/90 flex justify-center items-center z-50">
            <div className="p-5 bg-white rounded-lg shadow-md text-center">
              <p className="text-red-600 font-bold mb-2">{error}</p>
              <button
                onClick={fetchMapData}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div className="absolute inset-0 bg-white/90 flex justify-center items-center z-50">
            <div className="p-5 bg-white rounded-lg shadow-md">
              Tidak ada data peta yang tersedia
            </div>
          </div>
        )}

        <MapContainer
          center={[-6.75, 108.05861]}
          zoom={17}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
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
                    <Tooltip permanent={false} direction="center">
                      {item.name}
                    </Tooltip>
                    <Popup>
                      <div className="text-center">
                        <strong className="text-base" style={{ color }}>
                          {item.name}
                        </strong>
                        <p className="my-2 text-sm">{item.description}</p>
                        <p className="my-1 text-xs text-gray-500">
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
                icon={createIcon(
                  item.icon || (iconError ? fallbackIconUrl : defaultIconUrl)
                )}
              >
                <Tooltip permanent={false}>{item.name}</Tooltip>
                <Popup>
                  <div className="text-center">
                    <strong className="text-base text-red-600">
                      {item.name}
                    </strong>
                    <p className="my-2 text-sm">{item.description}</p>
                    <p className="my-1 text-xs text-gray-500">
                      Koordinat: {item.coordinates[0][0].toFixed(6)},{" "}
                      {item.coordinates[0][1].toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
          )}
        </MapContainer>
      </div>

      {/* Legenda di bawah peta - DINAMIS */}
      <div className="px-5 py-5 bg-gray-100 border-t border-gray-300">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center mb-4">
            <strong className="text-base text-gray-800 mr-5">Legenda:</strong>

            {/* Menampilkan legenda secara dinamis */}
            <div className="flex flex-wrap gap-5 flex-1">
              {/* Poligon legend: warna dan label sinkron dengan peta */}
              {polygonLegendData.map((poly, idx) => (
                <div
                  key={`legend-poly-${poly.id}`}
                  className="flex items-center gap-2"
                >
                  <div
                    className="flex items-center"
                    style={{
                      width: "40px",
                      height: "0px",
                      borderTop: `2px dotted ${poly.color}`,
                    }}
                  ></div>
                  <span className="text-sm text-gray-800">{poly.label}</span>
                </div>
              ))}
              {/* Marker legend */}
              {legendItems
                .filter((item) => item.type === "marker")
                .map((item, index) => (
                  <div
                    key={`legend-marker-${index}`}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-5 h-5 bg-contain bg-no-repeat"
                      style={{ backgroundImage: `url('${item.icon}')` }}
                      onError={(e) => {
                        e.target.style.backgroundImage = `url('${fallbackIconUrl}')`;
                      }}
                    ></div>
                    <span className="text-sm text-gray-800">
                      {item.label}
                      {item.items &&
                        item.items.length > 1 &&
                        ` (${item.items.length})`}
                    </span>
                  </div>
                ))}

              {/* Jika tidak ada item legenda */}
              {legendItems.length === 0 && (
                <span className="text-sm text-gray-500 italic">
                  Tidak ada item untuk ditampilkan
                </span>
              )}
            </div>

            <div className="ml-auto text-xs text-gray-500 italic">
              Desa Babakan Asem, Kecamatan Congeang
            </div>
          </div>

          {/* Detail POI jika diperlukan untuk legenda yang lebih detail */}
          {legendItems
            .filter(
              (item) =>
                item.type === "marker" && item.items && item.items.length > 0
            )
            .map((category, idx) => (
              <div key={`category-${idx}`} className="mt-2">
                <strong className="text-sm text-gray-700">
                  {category.label}:
                </strong>
                <div className="flex flex-wrap gap-4 mt-1">
                  {category.items.map((itemName, i) => {
                    // Find the corresponding marker data for icon
                    const markerData = filteredData.find(
                      (d) =>
                        d.type === "marker" &&
                        d.name === itemName &&
                        d.category === category.category
                    );
                    const iconUrl = markerData
                      ? markerData.icon
                      : iconError
                      ? fallbackIconUrl
                      : defaultIconUrl;
                    return (
                      <div
                        key={`poi-icon-${i}`}
                        className="flex items-center gap-1"
                      >
                        <div
                          className="w-5 h-5 bg-contain bg-no-repeat"
                          style={{ backgroundImage: `url('${iconUrl}')` }}
                        ></div>
                        <span className="text-xs text-gray-800">
                          {itemName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Footer dengan credit */}
      <div className="px-5 py-2 bg-gray-200 border-t border-gray-300 text-xs text-gray-500 text-center">
        <span>
          &copy; {new Date().getFullYear()} Desa Babakan Asem, Kecamatan
          Congeang.
        </span>
        <br />
        <span>Seluruh hak cipta dilindungi.</span>
      </div>
    </div>
  );
}
