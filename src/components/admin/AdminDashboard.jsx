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
  FaDatabase
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

  // Data dummy untuk fitur baru
  const strukturPreview = [
    { nama: "Budi Santoso", jabatan: "Kepala Desa", rw: "Seluruh Desa" },
    { nama: "Siti Rahayu", jabatan: "Sekretaris Desa", rw: "-" },
    { nama: "Agus Wijaya", jabatan: "Bendahara Desa", rw: "-" },
  ];
  
  const dokumenPreview = [
    { nama_dokumen: "Peraturan Desa 2023", jenis_dokumen: "Perdes", link: "#" },
    { nama_dokumen: "Laporan Keuangan 2023", jenis_dokumen: "Laporan", link: "#" },
    { nama_dokumen: "Rencana Kerja 2024", jenis_dokumen: "Rencana", link: "#" },
  ];
  
  const programKerjaPreview = [
    { judul: "Pembangunan Jalan Desa", deskripsi: "Peningkatan infrastruktur jalan", status: "Berjalan" },
    { judul: "Pelatihan UMKM", deskripsi: "Peningkatan kapasitas wirausaha", status: "Selesai" },
    { judul: "Penanaman Pohon", deskripsi: "Program penghijauan desa", status: "Rencana" },
  ];

  // - DATA DEMO PENDUDUK
  const pendudukData = [
    { name: t("adminDashboard.infographics.categories.male"), jumlah: 320 },
    { name: t("adminDashboard.infographics.categories.female"), jumlah: 340 },
    {
      name: t("adminDashboard.infographics.categories.headOfFamily"),
      jumlah: 120,
    },
    { name: t("adminDashboard.infographics.categories.children"), jumlah: 210 },
  ];

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
  }, []);

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
          onClick={() => navigate("/admin/dashboard")}
        />
        
        <SmallMainCard
          icon={<FaDatabase className="text-xl text-blue-500" />}
          title="Data Master"
          onClick={() => navigate("/admin/data-master")}
        />
        
        <SmallMainCard
          icon={<FaFolderOpen className="text-xl text-purple-500" />}
          title="Repository Dokumen"
          onClick={() => navigate("/admin/repository")}
        />
        
        <SmallMainCard
          icon={<FaMapMarkedAlt className="text-xl text-yellow-500" />}
          title="GIS Desa"
          onClick={() => navigate("/admin/gis-desa")}
        />
      </div>

      {/* - GRID STATISTIK DETAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DetailStatCard
          icon={<FaNewspaper className="text-green-500" />}
          title={t("adminDashboard.statistics.news")}
          count={newsCount}
          detail="Artikel terbaru"
          onClick={() => navigate("/admin/manage-news")}
        />
        
        <DetailStatCard
          icon={<FaCalendarAlt className="text-blue-500" />}
          title={t("adminDashboard.statistics.agenda")}
          count={agendaCount}
          detail="Kegiatan mendatang"
          onClick={() => navigate("/admin/manage-agenda")}
        />
        
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
          icon={<FaTasks className="text-cyan-500" />}
          title="Program Kerja"
          count={programCount}
          detail="Aktivitas desa"
          onClick={() => navigate("/admin/manage-program")}
        />
        
        <DetailStatCard
          icon={<FaSitemap className="text-red-500" />}
          title="Struktur Desa"
          count={strukturPreview.length}
          detail="Pengurus desa"
          onClick={() => navigate("/admin/struktur-desa")}
        />
        
        <DetailStatCard
          icon={<FaFolderOpen className="text-amber-500" />}
          title="Repository"
          count={dokumenPreview.length}
          detail="Dokumen resmi"
          onClick={() => navigate("/admin/repository")}
        />
        
        <DetailStatCard
          icon={<FaStore className="text-teal-500" />}
          title="BUMDes"
          count={bumdesPreview.length}
          detail="Produk unggulan"
          onClick={() => navigate("/admin/manage-bumdes")}
        />
      </div>

      {/* - INFROGRAFIS PENDUDUK */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t("adminDashboard.infographics.title")}
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={pendudukData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="jumlah"
              fill="#B6F500"
              barSize={40}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 text-center mt-3">
          {t("adminDashboard.infographics.subtitle")}
        </p>
      </div>

      {/* - PREVIEW SECTIONS DENGAN URUTAN BARU */}
      <PreviewSection
        title="Struktur Desa"
        icon={<FaSitemap />}
        data={strukturPreview.map((s) => ({
          title: s.nama,
          desc: s.jabatan,
          rw: s.rw,
        }))}
        onClick={() => navigate("/admin/struktur-desa")}
      />

      <PreviewSection
        title="Program Kerja Desa"
        icon={<FaTasks />}
        data={programKerjaPreview.map((p) => ({
          title: p.judul,
          desc: p.deskripsi,
          status: p.status,
        }))}
        onClick={() => navigate("/admin/manage-program")}
        showStatus={true}
      />

      <PreviewSection
        title="Repository Dokumen"
        icon={<FaFolderOpen />}
        data={dokumenPreview.map((d) => ({
          title: d.nama_dokumen,
          desc: d.jenis_dokumen,
          link: d.link
        }))}
        onClick={() => navigate("/admin/repository")}
        showLink={true}
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
        title={t("adminDashboard.preview.administration.title")}
        icon={<FaClipboardList />}
        data={administrasiPreview.map((a) => ({
          title: a.name,
          desc: a.type,
        }))}
        onClick={() => navigate("/admin/manage-administrasi")}
      />

      <PreviewSection
        title={t("adminDashboard.preview.gallery.title")}
        icon={<FaImage />}
        data={galeriPreview.map((g) => ({
          title: g.title,
          img: `${import.meta.env.VITE_BASE_URL}/galeri/images/${g.image}`,
        }))}
        onClick={() => navigate("/admin/manage-galery")}
      />
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
  showValue = false
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
            <div key={idx} className="flex gap-3 items-center border-b pb-3 last:border-0">
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
                  <p className="text-sm font-semibold text-gray-700">{item.value}</p>
                )}
                
                {item.rw && (
                  <p className="text-xs text-gray-400 mt-1">RW: {item.rw}</p>
                )}
                
                {item.status && showStatus && (
                  <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                    item.status === "Berjalan" ? "bg-yellow-100 text-yellow-800" :
                    item.status === "Selesai" ? "bg-green-100 text-green-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
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