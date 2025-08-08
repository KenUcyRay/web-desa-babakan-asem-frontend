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
  FaTrash,
  FaDrawPolygon,
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
import { MemberApi } from "../../libs/api/MemberApi";
import { alertError } from "../../libs/alert";
import { VillageWorkProgramApi } from "../../libs/api/VillageWorkProgramApi";
import { LogActivityApi } from "../../libs/api/LogActivityApi";
import { Helper } from "../../utils/Helper";
import DialogMap from "../../DialogMap";
import { alertConfirm, alertSuccess } from "../../libs/alert";

// ==== ICON CUSTOM ====
const createIcon = (iconUrl) =>
  L.icon({
    iconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // State dari Tes.jsx
  const [showDialogMap, setShowDialogMap] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [mapData, setMapData] = useState([]);
  const [newsCount, setNewsCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [galeriCount, setGaleriCount] = useState(0);
  const [bumdesPreview, setBumdesPreview] = useState([]);
  const [administrasiPreview, setAdministrasiPreview] = useState([]);
  const [galeriPreview, setGaleriPreview] = useState([]);
  const [strukturPreview, setStrukturPreview] = useState([]);
  const [programKerjaPreview, setProgramKerjaPreview] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

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
          if (item.type === "POLYGON") {
            // Process polygon data - IMPORTANT: Swap coordinates for Leaflet
            formattedData.push({
              id: item.id,
              name: item.name,
              description: item.description || "Wilayah Desa",
              type: "polygon",
              year: item.year || 2025,
              // Transform coordinates: Leaflet expects [lat, lng] pairs
              coordinates: item.coordinates.map((coord) => [
                coord[1],
                coord[0],
              ]),
            });
          } else if (item.type === "MARKER") {
            // Process marker data - coordinates format correction
            formattedData.push({
              id: item.id,
              name: item.name,
              description: item.description || "Point of Interest",
              type: "marker",
              year: item.year || 2025,
              // For marker: Leaflet expects [lat, lng] position
              coordinates: [[item.coordinates[0], item.coordinates[1]]],
              icon: item.icon
                ? `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                    item.icon
                  }`
                : null,
            });
          }
        });
      }

      setMapData(formattedData);
    } catch (error) {
      console.error("Error fetching map data:", error);
    } finally {
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
    if (!res.ok) return;
    const data = await res.json();
    setGaleriPreview(data.galeri || []);
  };

  const fetchProgramKerjaPreview = async () => {
    const res = await VillageWorkProgramApi.getVillageWorkPrograms(
      i18n.language
    );
    if (!res.ok) return;
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
    if (!res.ok) return;
    const data = await res.json();
    setStrukturPreview(data.members || []);
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

  // State for DialogMap modal
  const handleDialogMapSubmit = async (payload) => {
    const response = await MapApi.create(payload, i18n.language);
    if (!response.ok) {
      Helper.errorResponseHandler(await response.json());
      return;
    }
    await fetchMapData();
    setShowDialogMap(false);
  };

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
      return alertError("Gagal menghapus data peta. Silakan coba lagi.");
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Ringkasan aktivitas dan statistik terbaru
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
        <div className="bg-gradient-to-r from-green-400 to-[#B6F500] p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <FaMapMarkedAlt className="text-blue-700 text-xl" />
              </div>
              Peta Digital Desa
            </h2>

            {/* Filter Tahun - Dynamic based on available years */}
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
            </div>
          </div>
        </div>

        <div
          className={`p-6 relative ${showDialogMap ? "invisible" : "visible"} `}
        >
          <div className="rounded-xl overflow-hidden  shadow-md border-2 border-green-100 relative">
            <MapContainer
              center={[-6.75, 108.05861]}
              zoom={15}
              scrollWheelZoom={true}
              className={"w-full h-[500px] z-0"}
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
                    icon={createIcon(item.icon)}
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
        </div>

        {/* LEGENDA PETA - Enhanced Card Style */}
        <div className="px-3 md:px-6 pb-6 md:pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaMapMarkedAlt className="text-green-600" />
              Legenda Peta
            </h3>
            <button
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition text-sm md:text-lg font-bold flex items-center gap-2 shadow-lg border-2 border-green-700 w-full sm:w-auto"
              onClick={() => setShowDialogMap(true)}
            >
              <span className="text-xl md:text-2xl leading-none">+</span>
              <span>Tambah Legenda</span>
            </button>
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
                            {marker.coordinates[0][0].toFixed(4)},{" "}
                            {marker.coordinates[0][1].toFixed(4)}
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
                <button
                  className="px-5 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium flex items-center gap-2"
                  onClick={() => setShowDialogMap(true)}
                >
                  <span className="text-xl">+</span> Tambah Item Legenda
                </button>
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

      {/* GRID KARTU UTAMA - DIKURANGI MENJADI 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
        <SmallMainCard
          icon={
            <FaChartBar className="text-xl text-white bg-green-500 p-2 rounded-lg" />
          }
          title={"Dashboard Desa"}
          description={"Statistik lengkap desa"}
          onClick={() => navigate("/admin/dashboard-desa")}
        />

        <SmallMainCard
          icon={
            <FaDatabase className="text-xl text-white bg-blue-500 p-2 rounded-lg" />
          }
          title={"Data Master"}
          description={"Kelola data dasar desa"}
          onClick={() => navigate("/admin/data-master")}
        />

        <SmallMainCard
          icon={
            <FaFolderOpen className="text-xl text-white bg-purple-500 p-2 rounded-lg" />
          }
          title={"Repository Dokumen"}
          description={"Arsip dokumen desa"}
          onClick={() =>
            window.open(
              "https://drive.google.com/drive/folders/1H6wPE94ywdVsbH3XF7z2UpJ23sKFajr_?usp=sharing",
              "_blank"
            )
          }
        />
      </div>

      {/* GRID STATISTIK DETAIL */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <DetailStatCard
          icon={<FaComments className="text-2xl text-orange-500" />}
          title={"Pesan"}
          count={messageCount}
          detail={"Pesan masuk"}
          onClick={() => navigate("/admin/manage-pesan")}
          color="bg-yellow-200"
        />

        <DetailStatCard
          icon={<FaUsers className="text-2xl text-purple-500" />}
          title={"Pengguna"}
          count={userCount}
          detail={"Pengguna terdaftar"}
          onClick={() => navigate("/admin/manage-user")}
          color="bg-purple-100"
        />

        <DetailStatCard
          icon={<FaSitemap className="text-2xl text-red-500" />}
          title={"Struktur Desa"}
          count={strukturPreview.length}
          detail={"Pengurus desa"}
          onClick={() => navigate("/admin/manage-anggota")}
          color="bg-red-100"
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

      {/* BARIS KOTAK BESAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Log Aktivitas */}
        <div className="lg:col-span-2">
          <ActivityLog activities={activityLog} />
        </div>

        {/* Statistik Tambahan */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-gray-500" />
              Statistik Konten
            </h3>
          </div>

          <div className="space-y-4">
            <StatItem
              icon={<FaNewspaper className="text-blue-500" />}
              title={"Berita"}
              value={newsCount}
              onClick={() => navigate("/admin/manage-news")}
            />

            <StatItem
              icon={<FaCalendarAlt className="text-green-500" />}
              title={"Agenda"}
              value={agendaCount}
              onClick={() => navigate("/admin/manage-agenda")}
            />

            <StatItem
              icon={<FaImage className="text-purple-500" />}
              title={"Galeri"}
              value={galeriCount}
              onClick={() => navigate("/admin/manage-galery")}
            />

            <StatItem
              icon={<FaTasks className="text-yellow-500" />}
              title={"Program Kerja"}
              value={programCount}
              onClick={() => navigate("/admin/manage-program")}
            />
          </div>
        </div>
      </div>

      {/* PREVIEW SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <PreviewSection
          title={"Struktur Desa"}
          icon={<FaSitemap className="text-blue-500" />}
          data={strukturPreview.map((s) => ({
            title: s.name || s.nama,
            desc: s.position || s.jabatan,
            rw: s.rw || "-",
          }))}
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
          onClick={() => navigate("/admin/manage-program")}
          showStatus={true}
          description={"Program dan kegiatan desa"}
        />

        <PreviewSection
          title={"Data Penduduk"}
          icon={<FaUserAlt className="text-purple-500" />}
          data={[
            {
              title: "Jumlah KK",
              value: "120 KK",
            },
            {
              title: "Penduduk Laki-laki",
              value: "320 Jiwa",
            },
            {
              title: "Penduduk Perempuan",
              value: "340 Jiwa",
            },
          ]}
          onClick={() => navigate("/admin/kelola-infografis/penduduk")}
          showValue={true}
          description={"Statistik kependudukan terbaru"}
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
          onClick={() => navigate("/admin/manage-galery")}
          description={"Galeri kegiatan desa"}
        />
      </div>

      {/* DialogMap modal */}
      {showDialogMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white/70 via-gray-100/80 to-green-100/70 backdrop-blur-xl">
          <div className="relative z-50">
            <div className="rounded-2xl shadow-2xl border border-green-200 bg-white/80 backdrop-blur-lg p-0 w-[95vw] max-w-3xl">
              <DialogMap
                open={showDialogMap}
                onClose={() => setShowDialogMap(false)}
                onSubmit={handleDialogMapSubmit}
                year={selectedYear}
              />
            </div>
          </div>
        </div>
      )}
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
  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaClock className="text-gray-500" />
          {"Log Aktivitas Terbaru"}
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          {"Lihat Semua"}
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
          Kelola
          <span className="ml-1">→</span>
        </button>
      </div>

      <div className="mt-4 flex-grow">
        {data.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 italic">Belum ada data</p>
            <button
              onClick={onClick}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Tambah data pertama
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
                    <FaEye className="mr-1" /> Lihat
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
          + {data.length - 3} {"lainnya"}
        </button>
      )}
    </div>
  );
}
