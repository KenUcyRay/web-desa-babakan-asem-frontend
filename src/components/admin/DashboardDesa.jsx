import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaImage,
  FaTasks,
  FaNewspaper,
  FaCalendarAlt,
  FaEye,
  FaArrowRight,
} from "react-icons/fa";
import { ProgramApi } from "../../libs/api/ProgramApi";
import { NewsApi } from "../../libs/api/NewsApi";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { alertError } from "../../libs/alert";
import { VillageWorkProgramApi } from "../../libs/api/VillageWorkProgramApi";
import { useTranslation } from "react-i18next";

export default function DashboardDesa() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [newsCount, setNewsCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [galeriPreview, setGaleriPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    const res = await NewsApi.getOwnNews(i18n.language);
    if (!res.ok) return;
    const data = await res.json();
    setNewsCount(data.data?.length || 0);
  };

  const fetchAgenda = async () => {
    const res = await AgendaApi.getOwnAgenda(i18n.language);
    if (!res.ok) return alertError("Gagal ambil agenda");
    const data = await res.json();
    setAgendaCount(data.agenda?.length || 0);
  };

  const fetchProgram = async () => {
    const res = await VillageWorkProgramApi.getVillageWorkPrograms(
      1,
      1,
      i18n.language
    );
    if (!res.ok) return alertError("Gagal ambil program");
    const data = await res.json();

    setProgramCount(data.length || 0);
  };

  const fetchGaleri = async () => {
    const res = await GaleryApi.getGaleri(1, 3, i18n.language);
    if (!res.ok) return alertError("Gagal ambil galeri");
    const data = await res.json();
    setGaleriPreview(data.galeri || []);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchNews(),
        fetchAgenda(),
        fetchProgram(),
        fetchGaleri(),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, [i18n.language]);

  const statsData = [
    {
      icon: <FaNewspaper />,
      title: "Jumlah Berita",
      count: newsCount,
      color: "from-blue-400 to-blue-500",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Jumlah Agenda",
      count: agendaCount,
      color: "from-emerald-400 to-emerald-500",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      icon: <FaTasks />,
      title: "Program Kerja",
      count: programCount,
      color: "from-violet-400 to-violet-500",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
    },
    {
      icon: <FaImage />,
      title: "Galeri Desa",
      count: galeriPreview.length,
      color: "from-rose-400 to-rose-500",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-full w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow h-32"
                ></div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 font-[Poppins,sans-serif]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-gradient bg-gradient-to-r from-green-500 to-green-500 bg-clip-text text-transparent">
              🏠 Dashboard Desa
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Pantau aktivitas dan konten desa Anda dalam satu tampilan yang
            komprehensif
          </p>
        </div>

        {/* Kartu statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              count={stat.count}
              color={stat.color}
              iconBg={stat.iconBg}
              iconColor={stat.iconColor}
            />
          ))}
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-8 mb-10 text-black">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Selamat Datang di Dashboard Desa! 👋
              </h2>
              <p className="text-black text-lg">
                Kelola semua konten dan informasi desa Anda dengan mudah
              </p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold">
                {new Date().toLocaleDateString("id-ID", { day: "numeric" })}
              </div>
              <div className="text-sm opacity-90">
                {new Date().toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Galeri preview */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="bg-rose-50 p-2 rounded-lg">
                  <FaImage className="text-rose-500 text-xl" />
                </div>
                Galeri Terbaru
              </h2>
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-500 hover:to-green-900 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => navigate("/admin/manage-galery")}
              >
                <FaEye />
                Lihat Semua
              </button>
            </div>
          </div>

          <div className="p-6">
            {galeriPreview.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galeriPreview.map((g, idx) => (
                  <GalleryCard key={idx} gallery={g} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <FaImage className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Belum Ada Galeri
                </h3>
                <p className="text-gray-500 mb-4">
                  Mulai tambahkan foto-foto kegiatan desa Anda
                </p>
                <button
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={() => navigate("/admin/manage-galery")}
                >
                  Tambah Galeri
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Dashboard terakhir diperbarui:{" "}
            {new Date().toLocaleString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Sistem Informasi Desa • Hak Cipta
            Dilindungi
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, count, color, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className={`bg-gradient-to-r ${color} h-2`}></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`${iconBg} p-3 rounded-lg`}>
            <div className={`${iconColor} text-2xl`}>{icon}</div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-800">{count}</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <span>Data terkini</span>
          <FaArrowRight className="ml-2 text-xs" />
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ gallery }) {
  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="relative overflow-hidden h-48">
        <img
          src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
            gallery.image
          }`}
          alt={gallery.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-800 group-hover:text-blue-500 transition-colors duration-300 line-clamp-2">
          {gallery.title}
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("id-ID")}
        </p>
      </div>
    </div>
  );
}
