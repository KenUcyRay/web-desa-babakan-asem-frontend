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
        const icon = marker.icon || (iconError ? fallbackIconUrl : defaultIconUrl);
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
    <div>
      {/* Header dengan Logo */}
      <div
        style={{
          padding: "10px 20px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #dee2e6",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={iconError ? fallbackIconUrl : defaultIconUrl}
          alt="Logo Desa Babakan Asem"
          style={{
            height: "40px",
            marginRight: "15px",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackIconUrl;
          }}
        />
        <h1 style={{ margin: 0, fontSize: "18px", color: "#333" }}>
          Peta Desa Babakan Asem
        </h1>
      </div>

      {/* Filter Tahun */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <label
          style={{ fontWeight: "bold", marginRight: "10px", fontSize: "14px" }}
        >
          Pilih Tahun:
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ced4da",
            fontSize: "14px",
          }}
        >
          {[2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Status Indikator */}
        {loading && (
          <span style={{ marginLeft: "15px", color: "#666", fontSize: "14px" }}>
            Memuat data...
          </span>
        )}
        {error && (
          <span
            style={{ marginLeft: "15px", color: "#dc2626", fontSize: "14px" }}
          >
            {error}
          </span>
        )}
      </div>

      {/* Map */}
      <div style={{ position: "relative", height: "70vh", width: "100%" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={iconError ? fallbackIconUrl : defaultIconUrl}
                alt="Loading"
                style={{
                  height: "30px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                }}
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
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#dc2626",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {error}
              </p>
              <button
                onClick={fetchMapData}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              Tidak ada data peta yang tersedia
            </div>
          </div>
        )}

        <MapContainer
          center={[-6.767, 108.067]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredData.map((item) =>
            item.type === "polygon" ? (
              (() => {
                const polygonIdx = polygonLegendData.findIndex(p => p.id === item.id);
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
                      <div style={{ textAlign: "center" }}>
                        <strong style={{ fontSize: "16px", color }}>{item.name}</strong>
                        <p style={{ margin: "8px 0", fontSize: "14px" }}>{item.description}</p>
                        <p style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>Kecamatan: Congeang</p>
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
                  <div style={{ textAlign: "center" }}>
                    <strong style={{ fontSize: "16px", color: "#dc2626" }}>
                      {item.name}
                    </strong>
                    <p style={{ margin: "8px 0", fontSize: "14px" }}>
                      {item.description}
                    </p>
                    <p
                      style={{
                        margin: "5px 0",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
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
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #dee2e6",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <strong
              style={{ fontSize: "16px", color: "#333", marginRight: "20px" }}
            >
              Legenda:
            </strong>

            {/* Menampilkan legenda secara dinamis */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                flex: 1,
              }}
            >
              {/* Poligon legend: warna dan label sinkron dengan peta */}
              {/* Poligon legend: warna dan label sinkron dengan peta */}
              {polygonLegendData.map((poly, idx) => (
                <div
                  key={`legend-poly-${poly.id}`}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "40px",
                      height: "0px",
                      borderTop: `2px dotted ${poly.color}`,
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", color: "#333" }}>{poly.label}</span>
                </div>
              ))}
              {/* Marker legend */}
              {legendItems.filter(item => item.type === "marker").map((item, index) => (
                <div
                  key={`legend-marker-${index}`}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundImage: `url('${item.icon}')`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                    }}
                    onError={(e) => {
                      e.target.style.backgroundImage = `url('${fallbackIconUrl}')`;
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    {item.label}
                    {item.items && item.items.length > 1 && ` (${item.items.length})`}
                  </span>
                </div>
              ))}

              {/* Jika tidak ada item legenda */}
              {legendItems.length === 0 && (
                <span
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  Tidak ada item untuk ditampilkan
                </span>
              )}
            </div>

            <div
              style={{
                marginLeft: "auto",
                fontSize: "12px",
                color: "#666",
                fontStyle: "italic",
              }}
            >
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
              <div key={`category-${idx}`} style={{ marginTop: "10px" }}>
                <strong style={{ fontSize: "13px", color: "#555" }}>
                  {category.label}:
                </strong>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginTop: "5px",
                  }}
                >
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
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundImage: `url('${iconUrl}')`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                          }}
                        ></div>
                        <span style={{ fontSize: "13px", color: "#333" }}>
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
      <div
        style={{
          padding: "10px 20px",
          backgroundColor: "#f1f1f1",
          borderTop: "1px solid #dee2e6",
          fontSize: "12px",
          color: "#666",
          textAlign: "center",
        }}
      >
        <span>&copy; {new Date().getFullYear()} Desa Babakan Asem, Kecamatan Congeang.</span><br />
        <span>Seluruh hak cipta dilindungi.</span>
      </div>
    </div>
  );
}
