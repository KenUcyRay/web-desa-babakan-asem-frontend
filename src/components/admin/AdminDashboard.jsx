import React, { useEffect, useState, useMemo } from "react";
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
  FaTrash,
  FaDrawPolygon,
  FaChild,
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
  Tooltip as LeafletTooltip,
  Circle,
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
import { MemberApi } from "../../libs/api/MemberApi";
import { alertError } from "../../libs/alert";
import { VillageWorkProgramApi } from "../../libs/api/VillageWorkProgramApi";
import { LogActivityApi } from "../../libs/api/LogActivityApi";
import { InfografisApi } from "../../libs/api/InfografisApi";
import { Helper } from "../../utils/Helper";
import DialogMap from "../../DialogMap";
import { alertConfirm, alertSuccess } from "../../libs/alert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// ==== ICON CUSTOM ====
const createIcon = (iconUrl) => {
  if (!iconUrl) {
    // fallback to Leaflet default icon
    return new L.Icon.Default();
  }
  return L.icon({
    iconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Colorful marker icon for dashboard
const getLeafletIcon = (color = "#3B82F6", size = 30) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: linear-gradient(135deg, ${color} 0%, ${darkenColor(
      color,
      20
    )} 100%);
      width: ${size}px;
      height: ${size}px;
      border-radius: 50% 50% 50% 0;
      border: 3px solid white;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1);
      position: relative;
    "><div style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    "></div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Helper function to darken color
const darkenColor = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
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

// Assign colors by order of appearance for guaranteed uniqueness
function getPolygonColorByIndex(index) {
  return polygonColors[index % polygonColors.length];
}

// Helper: safe JSON parse
function tryParseJSON(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
  return value;
}

// Helper: normalize polygon coordinates to array of [lat, lng]
function normalizePolygonCoordinates(input) {
  console.log("Normalizing coordinates:", input); // Debug

  // Handle if input is already array (from backend)
  if (Array.isArray(input)) {
    // Check if it's already in [lat, lng] format
    if (input.length > 0 && Array.isArray(input[0]) && input[0].length === 2) {
      const firstPoint = input[0];
      const lng = Number(firstPoint[0]);
      const lat = Number(firstPoint[1]);

      // If first coordinate looks like longitude (between -180 to 180)
      // and second looks like latitude (between -90 to 90), swap them
      if (Math.abs(lng) <= 180 && Math.abs(lat) <= 90) {
        if (Math.abs(lng) > Math.abs(lat)) {
          // Likely [lng, lat] format, convert to [lat, lng]
          return input.map((pt) => [Number(pt[1]), Number(pt[0])]);
        } else {
          // Already [lat, lng] format
          return input.map((pt) => [Number(pt[0]), Number(pt[1])]);
        }
      }
    }
    return input;
  }

  // Try to parse JSON string
  const parsed = tryParseJSON(input) ?? input;
  if (!Array.isArray(parsed) || parsed.length === 0) return null;

  // Handle nested arrays
  let coordsArray = parsed;
  if (Array.isArray(parsed[0]) && Array.isArray(parsed[0][0])) {
    coordsArray = parsed[0];
  }

  // Convert to [lat, lng] format
  const mapped = coordsArray
    .map((pt) => {
      if (!Array.isArray(pt) || pt.length < 2) return null;
      const lng = Number(pt[0]);
      const lat = Number(pt[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        // Convert [lng, lat] to [lat, lng]
        return [lat, lng];
      }
      return null;
    })
    .filter(Boolean);

  console.log("Normalized result:", mapped); // Debug
  return mapped.length ? mapped : null;
}

// Helper: normalize marker coordinates to [[lat,lng]]
function normalizeMarkerCoordinates(input) {
  const parsed = tryParseJSON(input) ?? input;
  // Could be [lng, lat] or [[lng, lat]] or {lng:.., lat:..}
  if (Array.isArray(parsed)) {
    if (parsed.length >= 2 && typeof parsed[0] === "number") {
      const lng = Number(parsed[0]);
      const lat = Number(parsed[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return [[lat, lng]];
    }
    if (Array.isArray(parsed[0]) && parsed[0].length >= 2) {
      const lng = Number(parsed[0][0]);
      const lat = Number(parsed[0][1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return [[lat, lng]];
    }
  }
  if (parsed && typeof parsed === "object") {
    const lat = Number(parsed.lat ?? parsed.latitude ?? parsed[1] ?? parsed[0]);
    const lng = Number(
      parsed.lng ?? parsed.longitude ?? parsed[0] ?? parsed[1]
    );
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [[lat, lng]];
  }
  return null;
}

function safeToFixedMaybe(val, dec = 6) {
  const num = Number(val);
  if (Number.isFinite(num)) return num.toFixed(dec);
  return "N/A";
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // State dari Tes.jsx
  const [selectedYear, setSelectedYear] = useState(2025);
  const [mapData, setMapData] = useState([]);
  const [newsCount, setNewsCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [galeriCount, setGaleriCount] = useState(0);
  const [bumdesPreview, setBumdesPreview] = useState([]);
  const [bumdesTotal, setBumdesTotal] = useState(0);
  const [administrasiPreview, setAdministrasiPreview] = useState([]);
  const [administrasiTotal, setAdministrasiTotal] = useState(0);
  const [galeriPreview, setGaleriPreview] = useState([]);
  const [strukturPreview, setStrukturPreview] = useState([]);
  const [strukturTotal, setStrukturTotal] = useState(0);
  const [programKerjaPreview, setProgramKerjaPreview] = useState([]);
  const [programKerjaTotal, setProgramKerjaTotal] = useState(0);
  const [activityLog, setActivityLog] = useState([]);
  const [idmData, setIdmData] = useState([]);
  const [idmStatus, setIdmStatus] = useState("-");
  const [populationMainData, setPopulationMainData] = useState([]);
  const [populationAgeData, setPopulationAgeData] = useState([]);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showBencana, setShowBencana] = useState(true);

  // In the fetchMapData function, update the polygon coordinate processing:
  const fetchMapData = async () => {
    try {
      const response = await MapApi.getAll(i18n.language);

      if (!response.ok) {
        throw new Error("Gagal mengambil data peta");
      }

      const responseData = await response.json();
      const formattedData = [];

      if (responseData.data && Array.isArray(responseData.data)) {
        responseData.data.forEach((item) => {
          try {
            if (item.type === "POLYGON") {
              console.log("Processing polygon in AdminDashboard:", item); // Debug
              const normalized = normalizePolygonCoordinates(item.coordinates);
              if (!normalized) {
                console.log(
                  "Failed to normalize polygon coordinates:",
                  item.coordinates
                );
                return;
              }

              formattedData.push({
                id: item.id,
                name: item.name,
                description: item.description || "Wilayah Desa",
                type: "polygon",
                year: item.year || 2025,
                coordinates: normalized, // already [lat,lng]
                color: item.color || null,
              });
            } else if (item.type === "MARKER") {
              const normalized = normalizeMarkerCoordinates(item.coordinates);
              if (!normalized) {
                return;
              }

              formattedData.push({
                id: item.id,
                name: item.name,
                description: item.description || "Point of Interest",
                type: "marker",
                year: item.year || 2025,
                coordinates: normalized, // [[lat,lng]]
                icon: item.icon
                  ? `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      item.icon
                    }`
                  : null,
                radius: item.radius || null,
                color: item.color || null,
              });
            }
          } catch (err) {}
        });
      }

      setMapData(formattedData);
    } catch (error) {}
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

  const fetchIdmData = async () => {
    try {
      // Fetch IDM data
      const res = await InfografisApi.getIdm(i18n.language);
      if (res.ok) {
        const data = await res.json();
        if (data.idm && Array.isArray(data.idm) && data.idm.length > 0) {
          setIdmData(
            data.idm
              .slice(-5)
              .map((d) => ({ year: d.year, skor: d.skor / 100 }))
          );
        }
      }

      // Fetch Extra IDM data
      try {
        const resExtra = await InfografisApi.getExtraIdm(i18n.language);
        if (resExtra.ok) {
          const extraData = await resExtra.json();
          if (
            extraData.extraIdm &&
            Array.isArray(extraData.extraIdm) &&
            extraData.extraIdm.length > 0
          ) {
            setIdmStatus(extraData.extraIdm[0].status_desa || "-");
          }
        }
      } catch (extraError) {
        console.log("Extra IDM fetch failed, using default status");
        setIdmStatus("-");
      }
    } catch (error) {
      console.log("IDM data fetch failed:", error);
      // Set default values on error
      setIdmData([]);
      setIdmStatus("-");
    }
  };

  const fetchPopulationData = async () => {
    try {
      const baseUrl =
        import.meta.env.VITE_NEW_BASE_URL || "http://localhost:4000/api";

      // Fetch main population data (gender, kepala keluarga, anak-anak)
      const [genderRes, kkRes, anakRes] = await Promise.all([
        fetch(`${baseUrl}/residents?type=GENDER`),
        fetch(`${baseUrl}/residents?type=KEPALA_KELUARGA`),
        fetch(`${baseUrl}/residents?type=ANAK_ANAK`),
      ]);

      if (genderRes.ok && kkRes.ok && anakRes.ok) {
        const [genderData, kkData, anakData] = await Promise.all([
          genderRes.json(),
          kkRes.json(),
          anakRes.json(),
        ]);

        const mainData = [
          ...(genderData.data || []),
          ...(kkData.data || []),
          ...(anakData.data || []),
        ].map((item) => ({ name: item.key, jumlah: item.value }));

        setPopulationMainData(mainData);
      }

      // Fetch age group data
      const ageRes = await fetch(`${baseUrl}/residents?type=USIA`);
      if (ageRes.ok) {
        const ageData = await ageRes.json();
        const sortedAgeData = (ageData.data || [])
          .sort((a, b) => {
            const aMatch = a.key.match(/\d+/);
            const bMatch = b.key.match(/\d+/);
            return aMatch && bMatch
              ? parseInt(aMatch[0]) - parseInt(bMatch[0])
              : a.key.localeCompare(b.key);
          })
          .map((item) => ({ name: item.key, value: item.value }));

        setPopulationAgeData(sortedAgeData);
      }
    } catch (error) {
      console.log("Population data fetch failed:", error);
    }
  };

  const fetchBumdesPreview = async () => {
    const res = await ProductApi.getOwnProducts(1, 3, i18n.language);
    if (!res.ok) return;
    const data = await res.json();
    setBumdesPreview(data.products || []);
    setBumdesTotal(data.total || 0);
  };

  const fetchAdministrasiPreview = async () => {
    const pengantar = await AdministrasiApi.getPengantar(
      "?size=3",
      i18n.language
    );
    if (!pengantar.ok) return;

    const pengantarData = await pengantar.json();
    const merge = [...pengantarData.data];
    setAdministrasiPreview(merge);
    setAdministrasiTotal(pengantarData.total || merge.length);
  };

  const fetchGaleriPreview = async () => {
    const res = await GaleryApi.getGaleri(1, 3, i18n.language);
    if (!res.ok) return;
    const data = await res.json();
    setGaleriPreview(data.galeri || []);
  };

  const fetchProgramKerjaPreview = async () => {
    const res = await VillageWorkProgramApi.getVillageWorkPrograms(
      1,
      3,
      i18n.language
    );
    if (!res.ok) return;
    const data = await res.json();
    setProgramKerjaPreview(data.data || []);
    setProgramKerjaTotal(data.total || 0);
  };

  const fetchStrukturPreview = async () => {
    const res = await MemberApi.getMembers(
      "village_government",
      1,
      3,
      i18n.language
    );
    if (!res.ok) return;
    const data = await res.json();
    setStrukturPreview(data.members || []);
    setStrukturTotal(data.total || 0);
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
    fetchNews();
    fetchAgenda();
    fetchMessages();
    fetchUsers();
    fetchProgramCount();
    fetchGaleriCount();
    fetchBumdesPreview();
    fetchAdministrasiPreview();
    fetchGaleriPreview();
    fetchProgramKerjaPreview();
    fetchStrukturPreview();
    fetchLog();
    fetchMapData(); // Tambahkan fetch map data
    fetchIdmData();
    fetchPopulationData();
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
        color: region.color || getPolygonColorByIndex(idx),
        label: `Batas ${region.name}`,
      }));
  }, [filteredData]);

  // After fetching map data, extract unique years and keep them sorted
  const uniqueYears = useMemo(() => {
    if (!mapData.length) return [new Date().getFullYear()]; // Default to current year if no data

    // Extract unique years from mapData and sort in descending order
    const years = [...new Set(mapData.map((item) => item.year))];
    return years.sort((a, b) => b - a); // Sort years in descending order
  }, [mapData]);

  // Update selectedYear state when years change
  useEffect(() => {
    if (uniqueYears.length > 0 && !uniqueYears.includes(selectedYear)) {
      setSelectedYear(uniqueYears[0]); // Set to the latest year
    }
  }, [uniqueYears, selectedYear]);

  const handleDeleteMapItem = async (id, name, type) => {
    const confirmed = await alertConfirm(
      `Hapus data peta?`,
      `Anda yakin ingin menghapus ${
        type === "polygon" ? "wilayah" : "titik"
      } "${name}"? Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmed) {
      return;
    }

    const response = await MapApi.delete(id, i18n.language);

    if (!response.ok) {
      await Helper.errorResponseHandler(await response.json());
      return;
    }

    // Refresh map data after successful deletion
    await fetchMapData();
    alertSuccess(
      `Berhasil menghapus ${
        type === "polygon" ? "wilayah" : "titik"
      } "${name}".`
    );
  };

  return (
    <div className="w-full font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6 overflow-x-hidden">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Ringkasan aktivitas dan statistik terbaru
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500 mb-2">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <CompactActivityLog activities={activityLog} />
        </div>
      </div>

      {/* PETA UTAMA - Dengan implementasi dari Tes.jsx */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-green-400 to-[#B6F500] p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <FaMapMarkedAlt className="text-blue-700 text-xl" />
              </div>
              Peta Digital Desa
            </h2>

            {/* Filter Tahun dan Toggle Polygon */}
            <div className="flex items-center gap-2 md:gap-4">
              <label className="text-black font-medium text-sm md:text-md">
                Pilih Tahun:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-2 py-1 md:px-3 md:py-2 rounded-md border text-sm"
              >
                {uniqueYears.map((year) => (
                  <option key={year} value={year} className="text-black">
                    {year}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowPolygons(!showPolygons)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                  showPolygons
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {showPolygons ? "Area" : "Area"}
              </button>
              <button
                onClick={() => setShowMarkers(!showMarkers)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                  showMarkers
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {showMarkers ? "Lokasi" : "Lokasi"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 relative">
          <div className="rounded-xl overflow-hidden  shadow-md border-2 border-green-100 relative">
            <MapContainer
              center={[-6.75, 108.05861]}
              zoom={15}
              scrollWheelZoom={true}
              className={"w-full h-[500px] z-0"}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />

              {/* Render POI dan Polygon dari API */}
              {filteredData.map((item) => {
                if (item.type === "polygon" && showPolygons) {
                  const polygonIdx = polygonLegendData.findIndex(
                    (p) => p.id === item.id
                  );
                  const color =
                    item.color || getPolygonColorByIndex(polygonIdx);
                  return (
                    <Polygon
                      key={item.id}
                      positions={item.coordinates}
                      pathOptions={{
                        color,
                        weight: 4,
                        opacity: 1,
                        fillColor: color,
                        fillOpacity: 0.3,
                        lineCap: "round",
                        lineJoin: "round",
                      }}
                    >
                      <LeafletTooltip permanent={false} direction="center">
                        {item.name}
                      </LeafletTooltip>
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
                } else if (item.type === "marker") {
                  const isBencana = item.name && item.name.includes("[");
                  const shouldShow = isBencana ? showBencana : showMarkers;

                  if (!shouldShow) return null;

                  return (
                    <React.Fragment key={item.id}>
                      <Marker
                        position={item.coordinates[0]}
                        icon={
                          item.icon
                            ? createIcon(item.icon)
                            : getLeafletIcon(item.color || "#3B82F6", 30)
                        }
                      >
                        <LeafletTooltip permanent={false}>
                          {item.name}
                        </LeafletTooltip>
                        <Popup>
                          <div className="text-center">
                            <strong className="text-base text-red-600">
                              {item.name}
                            </strong>
                            <p className="text-sm my-2">{item.description}</p>
                            <p className="text-xs text-gray-600">
                              Koordinat:{" "}
                              {safeToFixedMaybe(item.coordinates[0][0], 6)},{" "}
                              {safeToFixedMaybe(item.coordinates[0][1], 6)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                      {/* Circle for bencana with radius */}
                      {isBencana && (
                        <Circle
                          center={item.coordinates[0]}
                          radius={item.radius || 500}
                          pathOptions={{
                            color: item.color || "#EF4444",
                            weight: 3,
                            opacity: 0.8,
                            fillColor: item.color || "#EF4444",
                            fillOpacity: 0.2,
                            dashArray: "10, 5",
                            lineCap: "round",
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                }
                return null;
              })}
            </MapContainer>
          </div>
        </div>

        {/* LEGENDA PETA - Enhanced Card Style */}
        <div className="px-3 md:px-6 pb-6 md:pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaMapMarkedAlt className="text-green-600" />
              Legenda Peta
            </h3>
          </div>

          {/* Dynamic legend cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Polygon Legend Card - Enhanced */}
            {polygonLegendData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border-2 border-green-100 p-6 hover:shadow-xl transition-all duration-300">
                <h4 className="font-semibold text-xl text-gray-800 mb-4 flex items-center border-b border-green-100 pb-3">
                  <div className="w-8 h-8 mr-2 border-2 border-dashed rounded-md border-blue-500 flex items-center justify-center">
                    <FaDrawPolygon className="text-blue-500" />
                  </div>
                  Wilayah & Batas
                </h4>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {polygonLegendData.map((poly) => (
                    <div
                      key={`legend-poly-${poly.id}`}
                      className="flex items-center justify-between pl-3 pr-2 py-3 hover:bg-gray-50 rounded-lg group transition-colors border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-0 border-t-3 border-dashed"
                          style={{
                            borderColor: poly.color,
                            borderWidth: "2px",
                          }}
                        ></div>
                        <span className="text-base text-gray-700 font-medium">
                          {poly.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          handleDeleteMapItem(poly.id, poly.name, "polygon")
                        }
                        title="Hapus"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Markers Cards - Each marker gets its own card */}
            <div className="grid grid-cols-1 gap-4">
              {filteredData
                .filter((item) => item.type === "marker")
                .map((marker, index) => (
                  <div
                    key={`marker-card-${marker.id || index}`}
                    className="bg-white rounded-xl shadow-md border border-blue-100 p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 bg-contain bg-center bg-no-repeat rounded-md border border-gray-200 flex-shrink-0"
                        style={{
                          backgroundImage: `url('${marker.icon}')`,
                          backgroundSize: "contain",
                        }}
                      ></div>

                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-800 mb-1 text-base">
                          {marker.name}
                        </h5>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {marker.description}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                          <span>Koordinat:</span>
                          <code className="bg-gray-50 px-1 py-0.5 rounded">
                            {safeToFixedMaybe(marker.coordinates[0][0], 4)},{" "}
                            {safeToFixedMaybe(marker.coordinates[0][1], 4)}
                          </code>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                        onClick={() =>
                          handleDeleteMapItem(marker.id, marker.name, "marker")
                        }
                        title="Hapus"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* No data state - Enhanced */}
            {filteredData.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-200 p-8 col-span-full flex flex-col items-center justify-center">
                <div className="text-gray-400 mb-3">
                  <FaMapMarkedAlt size={48} />
                </div>
                <span className="text-lg text-gray-600 text-center mb-4">
                  Belum ada data legenda untuk ditampilkan
                </span>
              </div>
            )}
          </div>

          {/* Footer attribution - Enhanced */}
          <div className="mt-6 text-right">
            <span className="text-sm text-gray-500 italic">
              Desa Babakan Asem, Kecamatan Congeang
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: STATISTIK & GRAFIK */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaChartBar className="text-blue-600" />
          Statistik & Analitik
        </h2>

        {/* Grid Statistik Detail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <DetailStatCard
            icon={<FaComments className="text-2xl text-orange-500" />}
            title={"Pesan"}
            count={messageCount}
            detail={"Pesan masuk"}
            onClick={() => navigate("/admin/manage-pesan")}
            color="bg-orange-50"
          />
          <DetailStatCard
            icon={<FaUsers className="text-2xl text-purple-500" />}
            title={"Pengguna"}
            count={userCount}
            detail={"Pengguna terdaftar"}
            onClick={() => navigate("/admin/manage-user")}
            color="bg-purple-50"
          />
          <DetailStatCard
            icon={<FaSitemap className="text-2xl text-red-500" />}
            title={"Struktur Desa"}
            count={strukturPreview.length}
            detail={"Pengurus desa"}
            onClick={() => navigate("/admin/manage-anggota")}
            color="bg-red-50"
          />
          <DetailStatCard
            icon={<FaStore className="text-2xl text-teal-500" />}
            title={"BUMDes"}
            count={bumdesPreview.length}
            detail={"Produk unggulan"}
            onClick={() => navigate("/admin/manage-bumdes")}
            color="bg-teal-50"
          />
        </div>

        {/* Grafik IDM */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => navigate("/admin/kelola-infografis/idm")}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-full">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Indeks Desa Membangun (IDM)
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Status:{" "}
                <span className="font-medium text-green-600">{idmStatus}</span>
              </p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium ml-4 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
              Kelola →
            </button>
          </div>

          <div className="h-80">
            {idmData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={idmData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 14 }} />
                  <YAxis domain={[0.6, 1]} tick={{ fontSize: 14 }} />
                  <Tooltip
                    formatter={(value) => [value.toFixed(3), "Skor IDM"]}
                    labelFormatter={(label) => `Tahun ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="skor"
                    stroke="#B6F500"
                    strokeWidth={4}
                    dot={{
                      r: 6,
                      fill: "#B6F500",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8, fill: "#B6F500" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaChartBar className="mx-auto mb-2 text-4xl" />
                  <p className="text-lg">Belum ada data IDM</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grafik Data Utama Penduduk */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => navigate("/admin/kelola-infografis/penduduk")}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-full">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Data Utama Penduduk
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Distribusi berdasarkan gender, kepala keluarga, dan anak-anak
              </p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium ml-4 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
              Kelola →
            </button>
          </div>

          <div className="h-80">
            {populationMainData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={populationMainData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${value} Orang`, "Jumlah"]}
                    labelFormatter={(label) => label}
                  />
                  <Legend />
                  <Bar
                    dataKey="jumlah"
                    name="Jumlah Penduduk"
                    fill="#B6F500"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaUsers className="mx-auto mb-2 text-4xl" />
                  <p className="text-lg">Belum ada data penduduk</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grafik Kelompok Usia */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
          onClick={() => navigate("/admin/kelola-infografis/penduduk")}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-full">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Kelompok Usia Penduduk
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Distribusi penduduk berdasarkan kelompok usia
              </p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium ml-4 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
              Kelola →
            </button>
          </div>

          <div className="h-80">
            {populationAgeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={populationAgeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${value} Orang`, "Jumlah"]}
                    labelFormatter={(label) => `Kelompok ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Jumlah Penduduk"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorAge)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaChild className="mx-auto mb-2 text-4xl" />
                  <p className="text-lg">Belum ada data kelompok usia</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: MANAJEMEN KONTEN */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaFolderOpen className="text-green-600" />
          Manajemen Konten
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <PreviewSection
            title={"Struktur Desa"}
            icon={<FaSitemap className="text-blue-500" />}
            data={strukturPreview.map((s) => ({
              title: s.name || s.nama,
              desc: s.position || s.jabatan,
              rw: s.rw || "-",
            }))}
            totalCount={strukturTotal}
            onClick={() => navigate("/admin/manage-anggota")}
            description={"Pengurus dan struktur organisasi desa"}
          />

          <PreviewSection
            title={"Program Kerja Desa"}
            icon={<FaTasks className="text-green-500" />}
            data={programKerjaPreview.map((p) => ({
              title: p.title || p.judul || p.name,
              desc: p.description || p.deskripsi || p.desc,
              status: p.status || "Aktif",
            }))}
            totalCount={programKerjaTotal}
            onClick={() => navigate("/admin/manage-program")}
            showStatus={true}
            description={"Program dan kegiatan desa"}
          />

          <PreviewSection
            title={"Data Master"}
            icon={<FaDatabase className="text-purple-500" />}
            data={[
              { title: "Infografis Desa", desc: "Kelola data kependudukan" },
              { title: "Peta Digital", desc: "Sistem informasi geografis" },
              {
                title: "Statistik Konten",
                desc: "Data berita, agenda, galeri",
              },
            ]}
            totalCount={5}
            onClick={() => navigate("/admin/data-master")}
            description={"Akses semua data master desa"}
          />

          <PreviewSection
            title={"Produk BUMDes"}
            icon={<FaStore className="text-yellow-500" />}
            data={bumdesPreview.map((p) => ({
              title: p.product.title,
              desc: p.product.description,
              img: `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                p.product.featured_image
              }`,
            }))}
            totalCount={bumdesTotal}
            onClick={() => navigate("/admin/manage-bumdes")}
            description={"Produk unggulan BUMDes"}
          />

          <PreviewSection
            title={"Administrasi"}
            icon={<FaClipboardList className="text-red-500" />}
            data={administrasiPreview.map((a) => ({
              title: a.name,
              desc: a.type,
            }))}
            totalCount={administrasiTotal}
            onClick={() => navigate("/admin/manage-administrasi")}
            description={"Layanan administrasi warga"}
          />

          <PreviewSection
            title={"Galeri"}
            icon={<FaImage className="text-teal-500" />}
            data={galeriPreview.map((g) => ({
              title: g.title,
              img: `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                g.image
              }`,
            }))}
            totalCount={galeriCount}
            onClick={() => navigate("/admin/manage-galery")}
            description={"Galeri kegiatan desa"}
          />
        </div>
      </div>
    </div>
  );
}

// Komponen CompactActivityLog - Versi kecil untuk header
function CompactActivityLog({ activities }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayActivities = isExpanded ? activities : activities.slice(0, 3);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-3 transition-all duration-300 ${
        isExpanded ? "min-w-[400px] max-w-[500px]" : "min-w-[300px]"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <FaClock className="text-xs text-gray-400" />
          Aktivitas Terbaru
        </h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? "Perkecil" : "Lihat Semua"}
        </button>
      </div>

      <div
        className={`space-y-1 transition-all duration-300 ${
          isExpanded ? "max-h-96 overflow-y-auto" : ""
        }`}
      >
        {displayActivities.map((activity) => (
          <div key={activity.id} className="bg-gray-50 rounded px-2 py-1">
            <p className="text-xs font-medium text-gray-800 truncate">
              {activity.action}
            </p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 truncate">
                {activity.user.name}
              </p>
              <p className="text-xs text-gray-400 ml-2">
                {formatDateTime(activity.created_at)}
              </p>
            </div>
          </div>
        ))}
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
      className={`group relative p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${color} border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden`}
      onClick={onClick}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Top section with icon and number */}
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-white/80 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
            {icon}
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-gray-900 group-hover:text-gray-800 transition-colors leading-none">
              {count}
            </p>
          </div>
        </div>

        {/* Bottom section with title and detail */}
        <div className="mb-2">
          <h2 className="text-base font-bold text-gray-800 group-hover:text-gray-900 transition-colors mb-1">
            {title}
          </h2>
          <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">
            {detail}
          </p>
        </div>

        {/* Trend and hover indicator */}
        <div className="flex items-center justify-between">
          {trend && (
            <span className="text-xs bg-white/90 px-2 py-1 rounded-full text-gray-700 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all duration-300">
              {trend}
            </span>
          )}
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ml-auto">
            <svg
              className="w-3 h-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color
          .replace("bg-", "from-")
          .replace(
            "-50",
            "-400"
          )} to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
      ></div>
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
  totalCount = 0,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <span className="text-xl">{icon}</span>
            <span>{title}</span>
          </h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <button
          onClick={onClick}
          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center gap-1"
        >
          <span>Kelola</span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="flex-grow">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 italic mb-3">Belum ada data</p>
            <button
              onClick={onClick}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Tambah data pertama
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-start border-b pb-3 last:border-0 last:pb-0"
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
                    <FaEye className="mr-1" /> Lihat
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {totalCount > 3 && (
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onClick}
            className="text-sm text-gray-600 hover:text-gray-800 w-full text-center py-2 hover:bg-gray-50 rounded-lg transition-colors duration-300"
          >
            + {totalCount - 3} lainnya
          </button>
        </div>
      )}
    </div>
  );
}
