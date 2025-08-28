import { useState, useEffect } from "react";
import {
  FaUsers,
  FaMapMarkedAlt,
  FaNewspaper,
  FaCalendarAlt,
  FaTasks,
  FaImage,
  FaEnvelope,
  FaFolderOpen,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { alertError, alertSuccess } from "../../libs/alert";
import { NewsApi } from "../../libs/api/NewsApi";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { MessageApi } from "../../libs/api/MessageApi";
import { VillageWorkProgramApi } from "../../libs/api/VillageWorkProgramApi";
import { useTranslation } from "react-i18next";


export default function DataMaster() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    newsCount: 0,
    agendaCount: 0,
    programCount: 0,
    galeriCount: 0,
    pesanCount: 0,
  });



  // Fetch statistics for top cards
  const fetchStats = async () => {
    try {
      // Berita
      const newsRes = await NewsApi.getOwnNews(1, 1000, i18n.language);
      if (!newsRes.ok) return;
      const newsData = await newsRes.json();

      // Agenda
      const agendaRes = await AgendaApi.getOwnAgenda(
        1,
        1000,
        "",
        i18n.language
      );
      if (!agendaRes.ok) throw new Error("Gagal ambil agenda");
      const agendaData = await agendaRes.json();

      // Program Kerja
      const programRes = await VillageWorkProgramApi.getVillageWorkPrograms(
        1,
        1,
        i18n.language
      );
      if (!programRes.ok) throw new Error("Gagal ambil program");
      const programData = await programRes.json();

      // Galeri
      const galeriRes = await GaleryApi.getGaleri(1, 1, i18n.language);
      if (!galeriRes.ok) throw new Error("Gagal ambil galeri");
      const galeriData = await galeriRes.json();

      // Pesan
      const pesanRes = await MessageApi.get("", i18n.language);
      if (!pesanRes.ok) return;
      const pesanData = await pesanRes.json("?size=1000");

      setStats({
        newsCount: newsData.data?.length || 0,
        agendaCount: agendaData.agenda?.length || 0,
        programCount: programData.length || 0,
        galeriCount: galeriData.total || galeriData.galeri?.length || 0,
        pesanCount: pesanData.data.length || pesanData.messages?.length || 0,
      });
    } catch (error) {
      alertError(error.message);
    }
  };



  useEffect(() => {
    fetchStats();
  }, [i18n.language]);

  // Statistik untuk card bagian atas
  const statsData = [
    {
      id: 1,
      name: "Jumlah Berita",
      value: stats.newsCount,
      icon: <FaNewspaper className="text-blue-500 text-xl" />,
      link: "/admin/manage-berita",
    },
    {
      id: 2,
      name: "Jumlah Agenda",
      value: stats.agendaCount,
      icon: <FaCalendarAlt className="text-green-500 text-xl" />,
      link: "/admin/manage-agenda",
    },
    {
      id: 3,
      name: "Program Kerja",
      value: stats.programCount,
      icon: <FaTasks className="text-purple-500 text-xl" />,
      link: "/admin/manage-program",
    },
    {
      id: 4,
      name: "Galeri Desa",
      value: stats.galeriCount,
      icon: <FaImage className="text-red-500 text-xl" />,
      link: "/admin/manage-galery",
    },
    {
      id: 5,
      name: "Pesan Masuk",
      value: stats.pesanCount,
      icon: <FaEnvelope className="text-yellow-500 text-xl" />,
      link: "/admin/manage-pesan",
    },
  ];

  // Data master utama dengan perubahan
  const masterData = [
    {
      id: 1,
      name: "Data Infografis Desa",
      icon: <FaUsers className="text-blue-500 text-4xl" />,
      description: "Visualisasi data kependudukan dan statistik desa",
      longDescription:
        "Akses dashboard interaktif dengan berbagai grafik dan visualisasi data kependudukan, perkembangan desa, dan statistik penting lainnya yang disajikan secara informatif dan mudah dipahami.",
      buttonText: "Kelola Data",
      link: "/admin/kelola-infografis/penduduk",
    },
    {
      id: 10,
      name: "Sistem Informasi Geografis",
      icon: <FaMapMarkedAlt className="text-blue-600 text-4xl" />,
      description: "Peta digital wilayah desa dan fasilitas umum",
      longDescription:
        "Kelola data spasial desa seperti batas wilayah, fasilitas umum, dan titik penting. Tambahkan data baru untuk memperkaya informasi geografis desa.",
      buttonText: "Kelola SIG",
      link: "/admin/kelola-sig",
    },
  ];

  // Aksi cepat dengan perubahan
  const quickActions = [
    {
      id: 1,
      name: "Repository Docs",
      icon: <FaFolderOpen className="text-yellow-400 text-2xl" />,
      color: "from-blue-500 to-indigo-600",
      onClick: () => window.open("https://drive.google.com", "_blank"),
    },
    {
      id: 2,
      name: "Kelola Pengguna",
      icon: <FaUsers className="text-green-600 text-2xl" />,
      color: "from-green-500 to-teal-600",
      onClick: () => navigate("/admin/manage-user"),
    },
    {
      id: 3,
      name: "Administrasi Desa",
      icon: <FaCog className="text-black text-2xl" />,
      color: "from-purple-500 to-pink-600",
      onClick: () => navigate("/admin/manage-administrasi"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-blue-600">📋 Data Master</span> Desa
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kelola semua data dasar desa yang menjadi fondasi sistem informasi
            desa. Data master digunakan sebagai referensi untuk berbagai fitur
            dan laporan.
          </p>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {statsData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(item.link)}
            >
              <div className="bg-blue-50 p-2 rounded-full mb-2">
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-700">
                {item.name}
              </h3>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Aksi Cepat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className={`bg-gradient-to-br ${action.color} rounded-xl shadow-lg p-6 text-white cursor-pointer transition-transform duration-300 hover:scale-[1.02]`}
              onClick={action.onClick}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{action.name}</h2>
                  <p className="opacity-90">Klik untuk mengakses</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  {action.icon}
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full bg-white bg-opacity-90 text-gray-800 font-medium py-2.5 px-4 rounded-lg shadow hover:bg-opacity-100 transition">
                  Akses Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Data Master Cards - Diperbesar dan lebih sedikit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {masterData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="p-6 flex-grow">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-50 p-4 rounded-xl mr-5">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mt-4 mb-6">
                  {item.longDescription}
                </p>
              </div>

              <div className="px-6 pb-6">
                <button
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-400 to-[#B6F500] hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow transition-all duration-300"
                  onClick={
                    item.onClick ? item.onClick : () => navigate(item.link)
                  }
                >
                  <span className="text-lg">{item.buttonText}</span>
                </button>
              </div>

              <div className="bg-gradient-to-r from-green-400 to-[#B6F500] h-2 w-full"></div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p className="mt-2">
            © {new Date().getFullYear()} Sistem Informasi Desa • Hak Cipta
            Dilindungi
          </p>
        </div>
      </div>


    </div>
  );
}
