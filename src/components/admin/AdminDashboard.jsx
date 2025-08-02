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
import { VillageWorkProgramApi } from "../../libs/api/VillageWorkProgramApi";

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
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "edit",
      module: "Program Kerja",
      description: "Memperbarui status program 'Perbaikan Jalan'",
      user: "Admin Desa",
      timestamp: new Date(Date.now() - 15 * 60000), // 15 menit lalu
      icon: FaTasks,
      color: "text-yellow-500",
    },
    {
      id: 3,
      type: "upload",
      module: "Galeri",
      description: "Mengunggah 3 foto kegiatan desa",
      user: "Admin Desa",
      timestamp: new Date(Date.now() - 30 * 60000), // 30 menit lalu
      icon: FaImage,
      color: "text-green-500",
    },
    {
      id: 4,
      type: "view",
      module: "Pesan",
      description: "Membaca 5 pesan baru dari warga",
      user: "Admin Desa",
      timestamp: new Date(Date.now() - 45 * 60000), // 45 menit lalu
      icon: FaComments,
      color: "text-purple-500",
    },
    {
      id: 5,
      type: "create",
      module: "BUMDes",
      description: "Menambahkan produk baru 'Keripik Singkong'",
      user: "Admin Desa",
      timestamp: new Date(Date.now() - 60 * 60000), // 1 jam lalu
      icon: FaStore,
      color: "text-teal-500",
    },
  ]);

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
    setMessageCount(data.data?.length || 0);
  };

  const fetchUsers = async () => {
    const res = await UserApi.getAllUsers();
    if (!res.ok) return alertError(t("adminDashboard.errors.failedToGetUsers"));
    const data = await res.json();
    setUserCount(data.users?.length || 0);
  };

  const fetchProgramCount = async () => {
    const res = await VillageWorkProgramApi.getVillageWorkPrograms(1, 1);
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
      const pengantar = await AdministrasiApi.getPengantar();

      const merge = [...(await pengantar.json()).data.slice(0, 1)];
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
    const res = await VillageWorkProgramApi.getVillageWorkPrograms();
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
  }, []);

  return (
    <div className="w-full font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {t("adminDashboard.title")}
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

      {/* - EMPAT KARTU UTAMA DI ATAS - DIKECILKAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SmallMainCard
          icon={
            <FaChartBar className="text-xl text-white bg-green-500 p-2 rounded-lg" />
          }
          title="Dashboard Desa"
          description="Statistik lengkap desa"
          onClick={() => navigate("/admin/dashboard-desa")}
        />

        <SmallMainCard
          icon={
            <FaDatabase className="text-xl text-white bg-blue-500 p-2 rounded-lg" />
          }
          title="Data Master"
          description="Kelola data dasar desa"
          onClick={() => navigate("/admin/data-master")}
        />

        <SmallMainCard
          icon={
            <FaFolderOpen className="text-xl text-white bg-purple-500 p-2 rounded-lg" />
          }
          title="Repository Dokumen"
          description="Arsip dokumen desa"
          onClick={() =>
            window.open(
              "https://drive.google.com/drive/folders/1H6wPE94ywdVsbH3XF7z2UpJ23sKFajr_?usp=sharing",
              "_blank"
            )
          }
        />

        <SmallMainCard
          icon={
            <FaMapMarkedAlt className="text-xl text-white bg-yellow-500 p-2 rounded-lg" />
          }
          title="GIS Desa"
          description="Peta digital wilayah"
          onClick={() => navigate("/admin/gis-desa")}
        />
      </div>

      {/* - GRID STATISTIK DETAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DetailStatCard
          icon={<FaComments className="text-2xl text-orange-500" />}
          title={t("adminDashboard.statistics.messages")}
          count={messageCount}
          detail="Pesan masuk"
          onClick={() => navigate("/admin/manage-pesan")}
          color="bg-yellow-100"
        />

        <DetailStatCard
          icon={<FaUsers className="text-2xl text-purple-500" />}
          title={t("adminDashboard.statistics.users")}
          count={userCount}
          detail="Pengguna terdaftar"
          onClick={() => navigate("/admin/manage-user")}
          color="bg-purple-100"
        />

        <DetailStatCard
          icon={<FaSitemap className="text-2xl text-red-500" />}
          title="Struktur Desa"
          count={strukturPreview.length}
          detail="Pengurus desa"
          onClick={() => navigate("/admin/manage-anggota")}
          color="bg-red-100"
        />

        <DetailStatCard
          icon={<FaStore className="text-2xl text-teal-500" />}
          title="BUMDes"
          count={bumdesPreview.length}
          detail="Produk unggulan"
          onClick={() => navigate("/admin/manage-bumdes")}
          color="bg-teal-50"
        />
      </div>

      {/* - BARIS KOTAK BESAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Log Aktivitas */}
        <div className="lg:col-span-2">
          <ActivityLog
            activities={activityLog}
            formatTime={formatRelativeTime}
          />
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
              title="Berita"
              value={newsCount}
              onClick={() => navigate("/admin/manage-news")}
            />

            <StatItem
              icon={<FaCalendarAlt className="text-green-500" />}
              title="Agenda"
              value={agendaCount}
              onClick={() => navigate("/admin/manage-agenda")}
            />

            <StatItem
              icon={<FaImage className="text-purple-500" />}
              title="Galeri"
              value={galeriCount}
              onClick={() => navigate("/admin/manage-galery")}
            />

            <StatItem
              icon={<FaTasks className="text-yellow-500" />}
              title="Program Kerja"
              value={programCount}
              onClick={() => navigate("/admin/manage-program")}
            />
          </div>
        </div>
      </div>

      {/* - PREVIEW SECTIONS DENGAN GRID BARU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PreviewSection
          title="Struktur Desa"
          icon={<FaSitemap className="text-blue-500" />}
          data={strukturPreview.map((s) => ({
            title: s.name || s.nama,
            desc: s.position || s.jabatan,
            rw: s.rw || "-",
          }))}
          onClick={() => navigate("/admin/manage-anggota")}
          description="Pengurus dan struktur organisasi desa"
        />

        <PreviewSection
          title="Program Kerja Desa"
          icon={<FaTasks className="text-green-500" />}
          data={programKerjaPreview.map((p) => ({
            title: p.title || p.judul || p.name,
            desc: p.description || p.deskripsi || p.desc,
            status: p.status || "Aktif",
          }))}
          onClick={() => navigate("/admin/manage-program")}
          showStatus={true}
          description="Program dan kegiatan desa"
        />

        <PreviewSection
          title="Data Penduduk"
          icon={<FaUserAlt className="text-purple-500" />}
          data={[
            { title: "Jumlah KK", value: "120 KK" },
            { title: "Penduduk Laki-laki", value: "320 Jiwa" },
            { title: "Penduduk Perempuan", value: "340 Jiwa" },
          ]}
          onClick={() => navigate("/admin/kelola-infografis/penduduk")}
          showValue={true}
          description="Statistik kependudukan terbaru"
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
          description="Produk unggulan BUMDes"
        />

        <PreviewSection
          title={t("adminDashboard.preview.administration.title")}
          icon={<FaClipboardList className="text-red-500" />}
          data={administrasiPreview.map((a) => ({
            title: a.name,
            desc: a.type,
          }))}
          onClick={() => navigate("/admin/manage-administrasi")}
          description="Layanan administrasi warga"
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
          description="Galeri kegiatan desa"
        />
      </div>
    </div>
  );
}

// Komponen Baru: StatItem
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

// Komponen Log Aktivitas (diperbarui)
function ActivityLog({ activities, formatTime }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaClock className="text-gray-500" />
          Log Aktivitas Terbaru
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          const actionColors = {
            create: "bg-green-100 text-green-800",
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
                  actionColors[activity.type] || "bg-gray-100"
                }`}
              >
                <IconComponent className="text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                    {activity.module}
                  </span>
                  <span className="text-xs text-gray-500">{activity.user}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {formatTime(activity.timestamp)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// - KARTU UTAMA KECIL (diperbarui)
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

// - KARTU STATISTIK DENGAN DETAIL (diperbarui)
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

// - PREVIEW SECTION LIST (diperbarui)
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
  const { t } = useTranslation();

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
          Kelola <span className="ml-1">→</span>
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
          + {data.length - 3} lainnya
        </button>
      )}
    </div>
  );
}
