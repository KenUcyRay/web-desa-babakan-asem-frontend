import { useEffect, useState } from "react";
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
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUpload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  // State untuk data real (bukan dummy)
  const [strukturPreview, setStrukturPreview] = useState([]);
  const [dokumenPreview, setDokumenPreview] = useState([]);
  const [programKerjaPreview, setProgramKerjaPreview] = useState([]);

  // State untuk log aktivitas
  const [activityLog, setActivityLog] = useState([
    {
      id: 1,
      type: "create",
      module: "Berita",
      description: "Menambahkan berita baru 'Gotong Royong Desa'",
      user: "Admin Desa",
      timestamp: new Date(Date.now() - 5 * 60000), // 5 menit lalu
      icon: FaNewspaper,
      color: "text-blue-500"
    },
    {
      id: 2,
      type: "edit",
      module: "Program Kerja",
      description: "Memperbarui status program 'Perbaikan Jalan'",
      user: "Admin Desa",
      timestamp: new Date(Date.now() - 15 * 60000), // 15 menit lalu
      icon: FaTasks,
      color: "text-yellow-500"
    },
    {
      id: 3,
      type: "upload",
      module: "Galeri",
      description: "Mengunggah 3 foto kegiatan desa",
      user: "Admin Desa",
      timestamp: new Date(Date.now() - 30 * 60000), // 30 menit lalu
      icon: FaImage,
      color: "text-green-500"
    },
    {
      id: 4,
      type: "view",
      module: "Pesan",
      description: "Membaca 5 pesan baru dari warga",
      user: "Admin Desa",
      timestamp: new Date(Date.now() - 45 * 60000), // 45 menit lalu
      icon: FaComments,
      color: "text-purple-500"
    },
    {
      id: 5,
      type: "create",
      module: "BUMDes",
      description: "Menambahkan produk baru 'Keripik Singkong'",
      user: "Admin Desa",
      timestamp: new Date(Date.now() - 60 * 60000), // 1 jam lalu
      icon: FaStore,
      color: "text-teal-500"
    }
  ]);

  // State untuk data dusun
  const [dusunData, setDusunData] = useState([]);
  
  // - Fetch TOTAL data
  const fetchNews = async () => {
    const res = await NewsApi.getOwnNews();
    if (!res.ok) return alertError(t("adminDashboard.errors.failedToGetNews"));
    const data = await res.json();
    setNewsCount(data.news?.length || 0);
  };

  const fetchAgenda = async () => {
    const res = await AgendaApi.getOwnAgenda();
    if (!res.ok)
      return alertError(t("adminDashboard.errors.failedToGetAgenda"));
    const data = await res.json();
    setAgendaCount(data.agenda?.length || 0);
  };

  const fetchMessages = async () => {
    const res = await MessageApi.getMessages();
    if (!res.ok)
      return alertError(t("adminDashboard.errors.failedToGetMessages"));
    const data = await res.json();
    setMessageCount(data.messages?.length || 0);
  };

  const fetchUsers = async () => {
    const res = await UserApi.getAllUsers();
    if (!res.ok) return alertError(t("adminDashboard.errors.failedToGetUsers"));
    const data = await res.json();
    setUserCount(data.users?.length || 0);
  };

  const fetchProgramCount = async () => {
    const res = await ProgramApi.getPrograms(1, 1);
    if (!res.ok) return alertError("Gagal mengambil jumlah program");
    const data = await res.json();
    setProgramCount(data.total || 0);
  };

  const fetchGaleriCount = async () => {
    const res = await GaleryApi.getGaleri(1, 1);
    if (!res.ok) return alertError("Gagal mengambil jumlah galeri");
    const data = await res.json();
    setGaleriCount(data.total || 0);
  };

  // - Preview 3 item
  const fetchBumdesPreview = async () => {
    const res = await ProductApi.getOwnProducts(1, 3);
    if (!res.ok)
      return alertError(t("adminDashboard.errors.failedToGetBumdesProducts"));
    const data = await res.json();
    setBumdesPreview(data.products || []);
  };

  const fetchAdministrasiPreview = async () => {
    try {
      const online = await AdministrasiApi.getOnline();
      const layanan = await AdministrasiApi.getLayanan();
      const pengantar = await AdministrasiApi.getPengantar();

      const merge = [
        ...(await online.json()).data.slice(0, 1),
        ...(await layanan.json()).data.slice(0, 1),
        ...(await pengantar.json()).data.slice(0, 1),
      ];
      setAdministrasiPreview(merge);
    } catch (e) {
      alertError(t("adminDashboard.errors.failedToGetAdministrationPreview"));
    }
  };

  const fetchGaleriPreview = async () => {
    const res = await GaleryApi.getGaleri(1, 3);
    if (!res.ok)
      return alertError(t("adminDashboard.errors.failedToGetGallery"));
    const data = await res.json();
    setGaleriPreview(data.galeri || []);
  };

  const fetchPkkPreview = async () => {
    const res = await ProgramApi.getPrograms(1, 3);
    if (!res.ok)
      return alertError(t("adminDashboard.errors.failedToGetPkkPrograms"));
    const data = await res.json();
    setPkkPreview(data.programs || []);
  };

  const fetchProgramKerjaPreview = async () => {
    const res = await ProgramApi.getPrograms();
    if (!res.ok) return alertError("Gagal mengambil data program kerja");
    const data = await res.json();
    setProgramKerjaPreview(data || []);
  };

  const fetchStrukturPreview = async () => {
    const res = await MemberApi.getMembers("village_government", 1, 3);
    if (!res.ok) return alertError("Gagal mengambil data struktur desa");
    const data = await res.json();
    setStrukturPreview(data.members || []);
  };

  // Fetch data dusun
  const fetchDusunData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL_NEW || "http://localhost:4000/api";
      const response = await fetch(`${baseUrl}/residents?type=DUSUN`);
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data dusun");
      }
      
      const result = await response.json();
      const sortedData = (result.data || []).sort((a, b) => {
        const aKey = a.key.toLowerCase();
        const bKey = b.key.toLowerCase();
        const aMatch = aKey.match(/([a-z])/);
        const bMatch = bKey.match(/([a-z])/);

        if (aMatch && bMatch) {
          return aMatch[1].localeCompare(bMatch[1]);
        }
        return aKey.localeCompare(bKey);
      });
      
      setDusunData(sortedData);
    } catch (error) {
      console.error("Error fetching dusun data:", error);
      alertError("Gagal mengambil data penduduk per dusun");
    }
  };

  // Fungsi untuk format waktu relatif
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
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
    fetchPkkPreview();
    fetchProgramKerjaPreview();
    fetchStrukturPreview();
    fetchDusunData(); // Fetch dusun data
  }, []);

  // Tooltip untuk chart dusun
  const DusunTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold text-gray-800">{`${label}`}</p>
          <p className="text-blue-600">{`Jumlah: ${payload[0].value} orang`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full font-[Poppins,sans-serif]">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        {t("adminDashboard.title")}
      </h1>

      {/* - EMPAT KARTU UTAMA DI ATAS - DIKECILKAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SmallMainCard
          icon={<FaChartBar className="text-xl text-green-500" />}
          title="Dashboard Desa"
          onClick={() => navigate("/admin/dashboard-desa")} // ke DashboardDesa.jsx
        />

        <SmallMainCard
          icon={<FaDatabase className="text-xl text-blue-500" />}
          title="Data Master"
          onClick={() => navigate("/admin/data-master")} // ke DataMaster.jsx
        />

        <SmallMainCard
          icon={<FaFolderOpen className="text-xl text-purple-500" />}
          title="Repository Dokumen"
          onClick={() => window.open("https://drive.google.com/drive/folders/1H6wPE94ywdVsbH3XF7z2UpJ23sKFajr_?usp=sharing", "_blank")} // ganti dengan link Drive
        />

        <SmallMainCard
          icon={<FaMapMarkedAlt className="text-xl text-yellow-500" />}
          title="GIS Desa"
          onClick={() => navigate("/admin/gis-desa")} // ke GisDesa.jsx
        />
      </div>

      {/* - GRID STATISTIK DETAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DetailStatCard
          icon={<FaComments className="text-orange-500" />}
          title={t("adminDashboard.statistics.messages")}
          count={messageCount}
          detail="Pesan masuk"
          onClick={() => navigate("/admin/manage-pesan")}
        />

        <DetailStatCard
          icon={<FaUsers className="text-purple-500" />}
          title={t("adminDashboard.statistics.users")}
          count={userCount}
          detail="Pengguna terdaftar"
          onClick={() => navigate("/admin/manage-user")}
        />

        <DetailStatCard
          icon={<FaSitemap className="text-red-500" />}
          title="Struktur Desa"
          count={strukturPreview.length}
          detail="Pengurus desa"
          onClick={() => navigate("/admin/struktur-desa")}
        />

        <DetailStatCard
          icon={<FaStore className="text-teal-500" />}
          title="BUMDes"
          count={bumdesPreview.length}
          detail="Produk unggulan"
          onClick={() => navigate("/admin/manage-bumdes")}
        />
      </div>

      {/* Log Aktivitas */}
      <div className="mb-8">
        <ActivityLog activities={activityLog} formatTime={formatRelativeTime} />
      </div>

      {/* Grafik Distribusi Penduduk per Dusun */}
      {dusunData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-5 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaMapMarkedAlt className="text-blue-500" /> 
              Distribusi Penduduk per Dusun
            </h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dusunData.map(d => ({ name: d.key, jumlah: d.value }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<DusunTooltip />} />
              <Bar 
                dataKey="jumlah" 
                name="Jumlah Penduduk" 
                fill="#8884d8" 
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {dusunData.map((dusun, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span className="font-medium">{dusun.key}</span>
                </div>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {dusun.value} <span className="text-sm font-normal">orang</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* - PREVIEW SECTIONS DENGAN URUTAN BARU */}
      <PreviewSection
        title="Struktur Desa"
        icon={<FaSitemap />}
        data={strukturPreview.map((s) => ({
          title: s.name || s.nama,
          desc: s.position || s.jabatan,
          rw: s.rw || "-",
        }))}
        onClick={() => navigate("/admin/struktur-desa")}
      />

      <PreviewSection
        title="Program Kerja Desa"
        icon={<FaTasks />}
        data={programKerjaPreview.map((p) => ({
          title: p.title || p.judul || p.name,
          desc: p.description || p.deskripsi || p.desc,
          status: p.status || "Aktif",
        }))}
        onClick={() => navigate("/admin/manage-program")}
        showStatus={true}
      />

      <PreviewSection
        title="Data Penduduk"
        icon={<FaUserAlt />}
        data={[
          { title: "Jumlah KK", value: "120 KK" },
          { title: "Penduduk Laki-laki", value: "320 Jiwa" },
          { title: "Penduduk Perempuan", value: "340 Jiwa" },
        ]}
        onClick={() => navigate("/admin/master-penduduk")}
        showValue={true}
      />

      <PreviewSection
        title={t("adminDashboard.preview.bumdes.title")}
        icon={<FaStore />}
        data={bumdesPreview.map((p) => ({
          title: p.product.title,
          desc: p.product.description,
          img: `${import.meta.env.VITE_BASE_URL}/products/images/${
            p.product.featured_image
          }`,
        }))}
        onClick={() => navigate("/admin/manage-bumdes")}
      />
      
      <PreviewSection
        title={t("adminDashboard.preview.gallery.title")}
        icon={<FaImage />}
        data={galeriPreview.map((g) => ({
          title: g.title,
          img: `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${g.image}`,
        }))}
        onClick={() => navigate("/admin/manage-galery")}
      />
    </div>
  );
}

// Komponen Log Aktivitas
function ActivityLog({ activities, formatTime }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaClock className="text-gray-500" />
          Log Aktivitas
        </h3>
        <span className="text-xs text-gray-500">Hari ini</span>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex gap-3 items-start">
              <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                <IconComponent className="text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {activity.module}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// - KARTU UTAMA KECIL (4 di atas)
function SmallMainCard({ icon, title, onClick }) {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer flex items-center gap-3"
      onClick={onClick}
    >
      <div className="text-2xl text-gray-600">{icon}</div>
      <h2 className="text-lg font-medium text-gray-800">{title}</h2>
    </div>
  );
}

// - KARTU STATISTIK DENGAN DETAIL
function DetailStatCard({ icon, title, count, detail, onClick }) {
  return (
    <div
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl mb-2 text-gray-500">{icon}</div>
          <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        </div>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
      <p className="text-sm text-gray-500 mt-3">{detail}</p>
    </div>
  );
}

// - PREVIEW SECTION LIST YANG LEBIH FLEKSIBEL
function PreviewSection({
  title,
  icon,
  data,
  onClick,
  showLink = false,
  showStatus = false,
  showValue = false,
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {icon} {title}
        </h2>
        <button
          onClick={onClick}
          className="text-green-600 font-medium hover:underline flex items-center"
        >
          Lihat Semua <span className="ml-1">➜</span>
        </button>
      </div>
      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada data</p>
        ) : (
          data.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-3 items-center border-b pb-3 last:border-0"
            >
              {item.img && (
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-12 h-12 rounded object-cover"
                />
              )}

              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.title}</p>

                {item.desc && !showValue && (
                  <p className="text-sm text-gray-500">{item.desc}</p>
                )}

                {item.value && showValue && (
                  <p className="text-sm font-semibold text-gray-700">
                    {item.value}
                  </p>
                )}

                {item.rw && (
                  <p className="text-xs text-gray-400 mt-1">RW: {item.rw}</p>
                )}

                {item.status && showStatus && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full mt-1 ${
                      item.status === "Berjalan"
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
                  className="text-blue-500 hover:underline text-sm whitespace-nowrap"
                >
                  Lihat
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}