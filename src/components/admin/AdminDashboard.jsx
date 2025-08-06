import { useEffect, useState, useMemo } from "react";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaComments,
  FaUsers,
  FaStore,
  FaClipboardList,
  FaImage,
  FaTasks,
  FaMapMarkedAlt,
  FaUserAlt,
  FaFolderOpen,
  FaSitemap,
  FaChartBar,
  FaDatabase,
  FaClock,
  FaEye,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { MapApi } from "../../libs/api/MapApi"; // Pastikan path sesuai
import { NewsApi } from "../../libs/api/NewsApi";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { MessageApi } from "../../libs/api/MessageApi";
import { UserApi } from "../../libs/api/UserApi";
import { ProductApi } from "../../libs/api/ProductApi";
import { AdministrasiApi } from "../../libs/api/AdministrasiApi";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { ProgramApi } from "../../libs/api/ProgramApi";
import { MemberApi } from "../../libs/api/MemberApi";
import { alertError } from "../../libs/alert";
import { VillageWorkProgramApi } from "../../libs/api/VillageWorkProgramApi";
import { LogActivityApi } from "../../libs/api/LogActivityApi";
import { Helper } from "../../utils/Helper";

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // State untuk GIS Map
  const [geoData, setGeoData] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // State dari Tes.jsx
  const [selectedYear, setSelectedYear] = useState(2025);
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iconError, setIconError] = useState(false);

  const [newsCount, setNewsCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [galeriCount, setGaleriCount] = useState(0);

  const [bumdesPreview, setBumdesPreview] = useState([]);
  const [administrasiPreview, setAdministrasiPreview] = useState([]);
  const [galeriPreview, setGaleriPreview] = useState([]);
  const [pkkPreview, setPkkPreview] = useState([]);
  const [strukturPreview, setStrukturPreview] = useState([]);
  const [dokumenPreview, setDokumenPreview] = useState([]);
  const [programKerjaPreview, setProgramKerjaPreview] = useState([]);

  const [activityLog, setActivityLog] = useState([]);

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

  // Fetch GeoJSON untuk peta
  const fetchGeoData = async () => {
    try {
      setMapLoading(true);
      const res = await fetch("/geojson/desa-babakan-asem.geojson");
      if (!res.ok) throw new Error("Failed to load map data");
      const data = await res.json();
      setGeoData(data);
      setMapLoading(false);
    } catch (err) {
      setMapError(err.message);
      setMapLoading(false);
    }
  };

  const fetchNews = async () => {
    const res = await NewsApi.getOwnNews(i18n.language);
    if (!res.ok) return;
    const data = await res.json();
    setNewsCount(data.data?.length || 0);
  };

  const fetchAgenda = async () => {
    const res = await AgendaApi.getOwnAgenda(i18n.language);
    if (!res.ok) return;
    const data = await res.json();
    setAgendaCount(data.agenda?.length || 0);
  };

  const fetchMessages = async () => {
    const res = await MessageApi.get("?size=1000", i18n.language);
    if (!res.ok) return;
    const responseBody = await res.json();
    setMessageCount(responseBody.data?.length || 0);
  };

  const fetchUsers = async () => {
    const res = await UserApi.getAllUsers(1, 1000, i18n.language);
    if (!res.ok) return;
    const data = await res.json();
    setUserCount(data.data?.length || 0);
  };

  const fetchProgramCount = async () => {
    const res = await VillageWorkProgramApi.getVillageWorkPrograms(
      1,
      1,
      i18n.language
    );
    if (!res.ok) return;
    const data = await res.json();
    setProgramCount(data.total || 0);
  };

  const fetchGaleriCount = async () => {
    const res = await GaleryApi.getGaleri(1, 1, i18n.language);
    if (!res.ok) return;
    const data = await res.json();
    setGaleriCount(data.total || 0);
  };

  const fetchBumdesPreview = async () => {
    const res = await ProductApi.getOwnProducts(1, 3, i18n.language);
    if (!res.ok) return;
    const data = await res.json();
    setBumdesPreview(data.products || []);
  };

  const fetchAdministrasiPreview = async () => {
    const pengantar = await AdministrasiApi.getPengantar(
      "?size=3",
      i18n.language
    );
    if (!pengantar.ok) return;

    const merge = [...(await pengantar.json()).data];
    setAdministrasiPreview(merge);
  };

  const fetchGaleriPreview = async () => {
    const res = await GaleryApi.getGaleri(1, 3, i18n.language);
    if (!res.ok)
      return alertError(t("adminDashboard.errors.failedToGetGallery"));
    const data = await res.json();
    setGaleriPreview(data.galeri || []);
  };

  const fetchPkkPreview = async () => {
    const res = await ProgramApi.getPrograms(1, 3, i18n.language);
    if (!res.ok)
      return alertError(t("adminDashboard.errors.failedToGetPkkPrograms"));
    const data = await res.json();
    setPkkPreview(data.programs || []);
  };

  const fetchProgramKerjaPreview = async () => {
    const res = await VillageWorkProgramApi.getVillageWorkPrograms(
      i18n.language
    );
    if (!res.ok)
      return alertError(
        t("adminDashboard.errors.failedToGetWorkPrograms") ||
          "Gagal mengambil data program kerja"
      );
    const data = await res.json();
    setProgramKerjaPreview(data || []);
  };

  const fetchStrukturPreview = async () => {
    const res = await MemberApi.getMembers(
      "village_government",
      1,
      3,
      i18n.language
    );
    if (!res.ok)
      return alertError(
        t("adminDashboard.errors.failedToGetVillageStructure") ||
          "Gagal mengambil data struktur desa"
      );
    const data = await res.json();
    setStrukturPreview(data.members || []);
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1)
      return t("adminDashboard.timeFormat.justNow") || "Baru saja";
    if (minutes < 60)
      return `${minutes} ${
        t("adminDashboard.timeFormat.minutesAgo") || "menit lalu"
      }`;
    if (hours < 24)
      return `${hours} ${
        t("adminDashboard.timeFormat.hoursAgo") || "jam lalu"
      }`;
    return `${days} ${t("adminDashboard.timeFormat.daysAgo") || "hari lalu"}`;
  };

  const fetchLog = async () => {
    const res = await LogActivityApi.getAllActivities(
      "?page=1&size=6",
      i18n.language
    );
    if (!res.ok) return;
    const data = await res.json();
    setActivityLog(data.data || []);
  };

  useEffect(() => {
    fetchGeoData();
    fetchNews();
    fetchAgenda();
    fetchMessages();
    fetchUsers();
    fetchProgramCount();
    fetchGaleriCount();
    fetchBumdesPreview();
    fetchAdministrasiPreview();
    fetchGaleriPreview();
    fetchPkkPreview();
    fetchProgramKerjaPreview();
    fetchStrukturPreview();
    fetchLog();
    fetchMapData(); // Tambahkan fetch map data
  }, [i18n.language]);

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

  return (
    <div className="w-full font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {t("adminDashboard.title")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("adminDashboard.subtitle") ||
              "Ringkasan aktivitas dan statistik terbaru"}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* PETA UTAMA - Dengan implementasi dari Tes.jsx */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-green-400 to-[#B6F500] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <FaMapMarkedAlt className="text-blue-700 text-xl" />
              </div>
              {t("adminDashboard.gisMapTitle") || "Peta Digital Desa"}
            </h2>

            {/* Filter Tahun - dari Tes.jsx */}
            <div className="flex items-center gap-4">
              <label className="text-white font-medium text-md">
                Pilih Tahun:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 rounded-md border border-white/40 bg-white/20 
               text-white text-sm backdrop-blur-sm focus:outline-none 
               focus:ring-2 focus:ring-white/60 hover:bg-white/30 
               transition-colors duration-200"
              >
                {[2025, 2024].map((y) => (
                  <option key={y} value={y} className="text-gray-900">
                    {y}
                  </option>
                ))}
              </select>

              {/* Status Indikator */}
              {loading && (
                <span className="text-white text-sm opacity-80">
                  Memuat data...
                </span>
              )}
              {error && <span className="text-red-200 text-sm">{error}</span>}
            </div>
          </div>
        </div>

        <div className="p-6 relative">
          {/* Loading states dari Tes.jsx */}
          {loading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-70 flex justify-center items-center z-50 rounded-xl">
              <div className="bg-white p-5 rounded-lg shadow-lg flex items-center gap-3">
                <img
                  src={iconError ? fallbackIconUrl : defaultIconUrl}
                  alt="Loading"
                  className="h-8"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackIconUrl;
                  }}
                />
                <span className="text-gray-700">Memuat data peta...</span>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-90 flex justify-center items-center z-50 rounded-xl">
              <div className="bg-white p-5 rounded-lg shadow-lg text-center">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button
                  onClick={fetchMapData}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredData.length === 0 && (
            <div className="h-[500px] rounded-xl bg-gray-100 flex items-center justify-center">
              <p className="text-gray-600">Tidak ada data peta yang tersedia</p>
            </div>
          )}

          {mapLoading ? (
            <div className="h-[500px] rounded-xl bg-gray-100 flex items-center justify-center">
              <p>{t("adminDashboard.gisMapLoading") || "Memuat peta..."}</p>
            </div>
          ) : mapError ? (
            <div className="h-[500px] rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              {t("adminDashboard.gisMapError") || "Error: "} {mapError}
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden shadow-md border-2 border-green-100 relative">
              <MapContainer
                center={[-6.75, 108.05861]}
                zoom={15}
                scrollWheelZoom={true}
                className="w-full h-[500px]"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render POI dan Polygon dari API */}
                {filteredData.map((item) =>
                  item.type === "polygon" ? (
                    (() => {
                      const polygonIdx = polygonLegendData.findIndex(
                        (p) => p.id === item.id
                      );
                      const color =
                        polygonLegendData[polygonIdx]?.color || "#2563eb";
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
                              <p className="text-sm my-2">{item.description}</p>
                              <p className="text-xs text-gray-600">
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
                        item.icon ||
                          (iconError ? fallbackIconUrl : defaultIconUrl)
                      )}
                    >
                      <Tooltip permanent={false}>{item.name}</Tooltip>
                      <Popup>
                        <div className="text-center">
                          <strong className="text-base text-red-600">
                            {item.name}
                          </strong>
                          <p className="text-sm my-2">{item.description}</p>
                          <p className="text-xs text-gray-600">
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
          )}
        </div>

        {/* LEGENDA PETA - Gabungan static dan dynamic */}
        <div className="px-6 pb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Legenda:
            </h3>
          </div>

          {/* Dynamic legend dari data API */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">
              Points of Interest:
            </h4>
            <div className="flex flex-wrap gap-4 mb-4">
              {/* Polygon legend */}
              {polygonLegendData.map((poly) => (
                <div
                  key={`legend-poly-${poly.id}`}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-8 h-0 border-t-2 border-dashed"
                    style={{ borderColor: poly.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{poly.label}</span>
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
                    ></div>
                    <span className="text-sm text-gray-700">
                      {item.label}
                      {item.items &&
                        item.items.length > 1 &&
                        ` (${item.items.length})`}
                    </span>
                  </div>
                ))}

              {legendItems.length === 0 && polygonLegendData.length === 0 && (
                <span className="text-sm text-gray-500 italic">
                  Tidak ada item untuk ditampilkan
                </span>
              )}
            </div>

            {/* Detail POI */}
            {legendItems
              .filter(
                (item) =>
                  item.type === "marker" && item.items && item.items.length > 0
              )
              .map((category, idx) => (
                <div key={`category-${idx}`} className="mt-3">
                  <strong className="text-sm text-gray-600">
                    {category.label}:
                  </strong>
                  <div className="flex flex-wrap gap-3 mt-2">
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
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-5 h-5 bg-contain bg-no-repeat"
                            style={{ backgroundImage: `url('${iconUrl}')` }}
                          ></div>
                          <span className="text-sm text-gray-700">
                            {itemName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

            <div className="mt-4 text-right">
              <span className="text-xs text-gray-500 italic">
                Desa Babakan Asem, Kecamatan Congeang
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID KARTU UTAMA - DIKURANGI MENJADI 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SmallMainCard
          icon={
            <FaChartBar className="text-xl text-white bg-green-500 p-2 rounded-lg" />
          }
          title={
            t("adminDashboard.mainCards.dashboardVillage") || "Dashboard Desa"
          }
          description={
            t("adminDashboard.mainCards.dashboardVillageDesc") ||
            "Statistik lengkap desa"
          }
          onClick={() => navigate("/admin/dashboard-desa")}
        />

        <SmallMainCard
          icon={
            <FaDatabase className="text-xl text-white bg-blue-500 p-2 rounded-lg" />
          }
          title={t("adminDashboard.mainCards.dataMaster") || "Data Master"}
          description={
            t("adminDashboard.mainCards.dataMasterDesc") ||
            "Kelola data dasar desa"
          }
          onClick={() => navigate("/admin/data-master")}
        />

        <SmallMainCard
          icon={
            <FaFolderOpen className="text-xl text-white bg-purple-500 p-2 rounded-lg" />
          }
          title={
            t("adminDashboard.mainCards.documentRepository") ||
            "Repository Dokumen"
          }
          description={
            t("adminDashboard.mainCards.documentRepositoryDesc") ||
            "Arsip dokumen desa"
          }
          onClick={() =>
            window.open(
              "https://drive.google.com/drive/folders/1H6wPE94ywdVsbH3XF7z2UpJ23sKFajr_?usp=sharing",
              "_blank"
            )
          }
        />
      </div>

      {/* GRID STATISTIK DETAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DetailStatCard
          icon={<FaComments className="text-2xl text-orange-500" />}
          title={t("adminDashboard.statistics.messages")}
          count={messageCount}
          detail={
            t("adminDashboard.statistics.messagesDetail") || "Pesan masuk"
          }
          onClick={() => navigate("/admin/manage-pesan")}
          color="bg-yellow-200"
        />

        <DetailStatCard
          icon={<FaUsers className="text-2xl text-purple-500" />}
          title={t("adminDashboard.statistics.users")}
          count={userCount}
          detail={
            t("adminDashboard.statistics.usersDetail") || "Pengguna terdaftar"
          }
          onClick={() => navigate("/admin/manage-user")}
          color="bg-purple-100"
        />

        <DetailStatCard
          icon={<FaSitemap className="text-2xl text-red-500" />}
          title={
            t("adminDashboard.statistics.villageStructure") || "Struktur Desa"
          }
          count={strukturPreview.length}
          detail={
            t("adminDashboard.statistics.villageStructureDetail") ||
            "Pengurus desa"
          }
          onClick={() => navigate("/admin/manage-anggota")}
          color="bg-red-100"
        />

        <DetailStatCard
          icon={<FaStore className="text-2xl text-teal-500" />}
          title={t("adminDashboard.statistics.bumdes") || "BUMDes"}
          count={bumdesPreview.length}
          detail={
            t("adminDashboard.statistics.bumdesDetail") || "Produk unggulan"
          }
          onClick={() => navigate("/admin/manage-bumdes")}
          color="bg-teal-50"
        />
      </div>

      {/* BARIS KOTAK BESAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Log Aktivitas */}
        <div className="lg:col-span-2">
          <ActivityLog activities={activityLog} />
        </div>

        {/* Statistik Tambahan */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-gray-500" />
              {t("adminDashboard.contentStatistics.title") ||
                "Statistik Konten"}
            </h3>
          </div>

          <div className="space-y-4">
            <StatItem
              icon={<FaNewspaper className="text-blue-500" />}
              title={t("adminDashboard.contentStatistics.news") || "Berita"}
              value={newsCount}
              onClick={() => navigate("/admin/manage-news")}
            />

            <StatItem
              icon={<FaCalendarAlt className="text-green-500" />}
              title={t("adminDashboard.contentStatistics.agenda") || "Agenda"}
              value={agendaCount}
              onClick={() => navigate("/admin/manage-agenda")}
            />

            <StatItem
              icon={<FaImage className="text-purple-500" />}
              title={t("adminDashboard.contentStatistics.gallery") || "Galeri"}
              value={galeriCount}
              onClick={() => navigate("/admin/manage-galery")}
            />

            <StatItem
              icon={<FaTasks className="text-yellow-500" />}
              title={
                t("adminDashboard.contentStatistics.workProgram") ||
                "Program Kerja"
              }
              value={programCount}
              onClick={() => navigate("/admin/manage-program")}
            />
          </div>
        </div>
      </div>

      {/* PREVIEW SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PreviewSection
          title={
            t("adminDashboard.preview.villageStructure.title") ||
            "Struktur Desa"
          }
          icon={<FaSitemap className="text-blue-500" />}
          data={strukturPreview.map((s) => ({
            title: s.name || s.nama,
            desc: s.position || s.jabatan,
            rw: s.rw || "-",
          }))}
          onClick={() => navigate("/admin/manage-anggota")}
          description={
            t("adminDashboard.preview.villageStructure.description") ||
            "Pengurus dan struktur organisasi desa"
          }
        />

        <PreviewSection
          title={
            t("adminDashboard.preview.workProgram.title") ||
            "Program Kerja Desa"
          }
          icon={<FaTasks className="text-green-500" />}
          data={programKerjaPreview.map((p) => ({
            title: p.title || p.judul || p.name,
            desc: p.description || p.deskripsi || p.desc,
            status: p.status || "Aktif",
          }))}
          onClick={() => navigate("/admin/manage-program")}
          showStatus={true}
          description={
            t("adminDashboard.preview.workProgram.description") ||
            "Program dan kegiatan desa"
          }
        />

        <PreviewSection
          title={
            t("adminDashboard.preview.population.title") || "Data Penduduk"
          }
          icon={<FaUserAlt className="text-purple-500" />}
          data={[
            {
              title:
                t("adminDashboard.preview.population.familyHeads") ||
                "Jumlah KK",
              value: "120 KK",
            },
            {
              title:
                t("adminDashboard.preview.population.malePopulation") ||
                "Penduduk Laki-laki",
              value: "320 Jiwa",
            },
            {
              title:
                t("adminDashboard.preview.population.femalePopulation") ||
                "Penduduk Perempuan",
              value: "340 Jiwa",
            },
          ]}
          onClick={() => navigate("/admin/kelola-infografis/penduduk")}
          showValue={true}
          description={
            t("adminDashboard.preview.population.description") ||
            "Statistik kependudukan terbaru"
          }
        />

        <PreviewSection
          title={t("adminDashboard.preview.bumdes.title")}
          icon={<FaStore className="text-yellow-500" />}
          data={bumdesPreview.map((p) => ({
            title: p.product.title,
            desc: p.product.description,
            img: `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
              p.product.featured_image
            }`,
          }))}
          onClick={() => navigate("/admin/manage-bumdes")}
          description={
            t("adminDashboard.preview.bumdes.description") ||
            "Produk unggulan BUMDes"
          }
        />

        <PreviewSection
          title={t("adminDashboard.preview.administration.title")}
          icon={<FaClipboardList className="text-red-500" />}
          data={administrasiPreview.map((a) => ({
            title: a.name,
            desc: a.type,
          }))}
          onClick={() => navigate("/admin/manage-administrasi")}
          description={
            t("adminDashboard.preview.administration.description") ||
            "Layanan administrasi warga"
          }
        />

        <PreviewSection
          title={t("adminDashboard.preview.gallery.title")}
          icon={<FaImage className="text-teal-500" />}
          data={galeriPreview.map((g) => ({
            title: g.title,
            img: `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
              g.image
            }`,
          }))}
          onClick={() => navigate("/admin/manage-galery")}
          description={
            t("adminDashboard.preview.gallery.description") ||
            "Galeri kegiatan desa"
          }
        />
      </div>
    </div>
  );
}

// Komponen StatItem
function StatItem({ icon, title, value, onClick }) {
  return (
    <div
      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
        <span className="font-medium text-gray-700">{title}</span>
      </div>
      <span className="text-lg font-bold text-gray-800">{value}</span>
    </div>
  );
}

// Komponen ActivityLog
function ActivityLog({ activities }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaClock className="text-gray-500" />
          {t("adminDashboard.activityLog.title") || "Log Aktivitas Terbaru"}
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          {t("adminDashboard.activityLog.viewAll") || "Lihat Semua"}
        </button>
      </div>

      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
        {activities.map((activity) => {
          const IconComponent = FaUser;
          const actionColors = {
            USER: "bg-green-100 text-green-800",
            edit: "bg-yellow-100 text-yellow-800",
            upload: "bg-blue-100 text-blue-800",
            view: "bg-purple-100 text-purple-800",
            delete: "bg-red-100 text-red-800",
          };

          return (
            <div
              key={activity.id}
              className="flex gap-3 items-start p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition"
            >
              <div
                className={`p-2 rounded-lg ${
                  actionColors[activity.location] || "bg-gray-100"
                }`}
              >
                <IconComponent className="text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {activity.action}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                    {activity.location}
                  </span>
                  <span className="text-xs text-gray-500">
                    {activity.user.name}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-400 whitespace-nowrap">
                {Helper.formatISODate(activity.created_at)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Komponen SmallMainCard
function SmallMainCard({ icon, title, description, onClick }) {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="mb-3">{icon}</div>
      <h2 className="text-lg font-medium text-gray-800 mb-1">{title}</h2>
      <p className="text-sm text-gray-600 flex-grow">{description}</p>
    </div>
  );
}

// Komponen DetailStatCard
function DetailStatCard({ icon, title, count, detail, trend, onClick, color }) {
  return (
    <div
      className={`p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer ${color} border-l-4 ${color.replace(
        "bg-",
        "border-"
      )}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-3">{icon}</div>
          <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        </div>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
      <div className="flex justify-between items-end mt-4">
        <p className="text-sm text-gray-600">{detail}</p>
        <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-700 shadow-sm">
          {trend}
        </span>
      </div>
    </div>
  );
}

// Komponen PreviewSection
function PreviewSection({
  title,
  icon,
  data,
  onClick,
  showLink = false,
  showStatus = false,
  showValue = false,
  description,
}) {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-1">
            {icon} {title}
          </h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <button
          onClick={onClick}
          className="text-blue-600 font-medium hover:text-blue-800 flex items-center text-sm"
        >
          {t("adminDashboard.preview.manage") || "Kelola"}{" "}
          <span className="ml-1">→</span>
        </button>
      </div>

      <div className="mt-4 flex-grow">
        {data.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 italic">
              {t("adminDashboard.preview.noData")}
            </p>
            <button
              onClick={onClick}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              {t("adminDashboard.preview.addFirstData") ||
                "Tambah data pertama"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {data.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start border-b pb-3 last:border-0"
              >
                {item.img && !showValue && (
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                )}

                <div className="flex-1">
                  {showValue ? (
                    <>
                      <p className="text-sm text-gray-600">{item.title}</p>
                      <p className="font-semibold text-gray-800">
                        {item.value}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      {item.desc && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.desc}
                        </p>
                      )}
                    </>
                  )}

                  {item.rw && (
                    <p className="text-xs text-gray-500 mt-1">RW: {item.rw}</p>
                  )}

                  {item.status && showStatus && (
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                        item.status === "Berjalan" || item.status === "Aktif"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "Selesai"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>

                {showLink && item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline text-sm whitespace-nowrap flex items-center"
                  >
                    <FaEye className="mr-1" />{" "}
                    {t("adminDashboard.preview.view") || "Lihat"}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {data.length > 3 && (
        <button
          onClick={onClick}
          className="mt-4 text-sm text-gray-600 hover:text-gray-800 w-full text-center"
        >
          + {data.length - 3} {t("adminDashboard.preview.others") || "lainnya"}
        </button>
      )}
    </div>
  );
}
