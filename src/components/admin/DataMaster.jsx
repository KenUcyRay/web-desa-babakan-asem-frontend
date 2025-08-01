import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaUsers,
  FaIdCard,
  FaMapMarkedAlt,
  FaPray,
  FaBriefcase,
  FaGraduationCap,
  FaHandHoldingHeart,
  FaNewspaper,
  FaCalendarAlt,
  FaTasks,
  FaImage,
  FaEnvelope,
  FaFolderOpen,
  FaCog,
  FaChartLine,
  FaMap,
} from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { MdVolunteerActivism } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { alertError } from "../../libs/alert";
import { NewsApi } from "../../libs/api/NewsApi";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { MessageApi } from "../../libs/api/MessageApi";
import { VillageWorkProgramApi } from "../../libs/api/VillageWorkProgramApi";

export default function DataMaster() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [stats, setStats] = useState({
    newsCount: 0,
    agendaCount: 0,
    programCount: 0,
    galeriCount: 0,
    pesanCount: 0,
  });
  const [masterStats, setMasterStats] = useState({
    pendudukCount: 0,
    kkCount: 0,
    wilayahCount: { dusun: 0, rw: 0, rt: 0 },
  });

  // Fetch statistics for top cards
  const fetchStats = async () => {
    try {
      // Berita
      const newsRes = await NewsApi.getOwnNews();
      if (!newsRes.ok) throw new Error("Gagal ambil berita");
      const newsData = await newsRes.json();

      // Agenda
      const agendaRes = await AgendaApi.getOwnAgenda();
      if (!agendaRes.ok) throw new Error("Gagal ambil agenda");
      const agendaData = await agendaRes.json();

      // Program Kerja
      const programRes = await VillageWorkProgramApi.getVillageWorkPrograms(
        1,
        1
      );
      if (!programRes.ok) throw new Error("Gagal ambil program");
      const programData = await programRes.json();

      // Galeri
      const galeriRes = await GaleryApi.getGaleri(1, 1);
      if (!galeriRes.ok) throw new Error("Gagal ambil galeri");
      const galeriData = await galeriRes.json();

      // Pesan
      const pesanRes = await MessageApi.getMessages();
      const pesanData = pesanRes.ok ? await pesanRes.json() : { total: 0 };

      setStats({
        newsCount: newsData.news?.length || 0,
        agendaCount: agendaData.agenda?.length || 0,
        programCount: programData.length || 0,
        galeriCount: galeriData.total || galeriData.galeri?.length || 0,
        pesanCount: pesanData.data.length || pesanData.messages?.length || 0,
      });
    } catch (error) {
      alertError(error.message);
    }
  };

  // Fetch statistics for master data cards
  // const fetchMasterStats = async () => {
  //   try {
  //     // Penduduk
  //     const pendudukRes = await PendudukApi.getPenduduk();
  //     const pendudukCount = pendudukRes.ok
  //       ? (await pendudukRes.json()).length
  //       : 0;

  //     // Kartu Keluarga
  //     const kkRes = await KartuKeluargaApi.getKartuKeluarga();
  //     const kkCount = kkRes.ok ? (await kkRes.json()).length : 0;

  //     // Wilayah
  //     const wilayahRes = await WilayahApi.getWilayah();
  //     const wilayahData = wilayahRes.ok ? await wilayahRes.json() : [];

  //     const wilayahCount = wilayahData.reduce(
  //       (acc, wilayah) => {
  //         acc.dusun += wilayah.dusun ? 1 : 0;
  //         acc.rw += wilayah.rw ? 1 : 0;
  //         acc.rt += wilayah.rt ? 1 : 0;
  //         return acc;
  //       },
  //       { dusun: 0, rw: 0, rt: 0 }
  //     );

  //     setMasterStats({
  //       pendudukCount,
  //       kkCount,
  //       wilayahCount,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching master stats:", error);
  //   }
  // };

  useEffect(() => {
    fetchStats();
    // fetchMasterStats();
  }, []);

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
      name: "Data Penduduk",
      icon: <FaUsers className="text-blue-500 text-3xl" />,
      description: "Kelola data seluruh penduduk desa secara komprehensif",
      category: "penduduk",
      stats: `${masterStats.pendudukCount.toLocaleString()} data`,
      link: "/admin/kelola-infografis/penduduk",
    },
    {
      id: 2,
      name: "Data KK",
      icon: <FaIdCard className="text-green-500 text-3xl" />,
      description:
        "Kelola data jumlah kartu keluarga dan hubungan antar anggota keluarga",
      category: "penduduk",
      stats: `${masterStats.kkCount} KK`,
      link: "/admin/kelola-infografis/penduduk",
    },
    {
      id: 3,
      name: "Wilayah Dusun",
      icon: <FaMapMarkedAlt className="text-purple-500 text-3xl" />,
      description: "Kelola pembagian wilayah administratif desa",
      category: "wilayah",
      stats: `${masterStats.wilayahCount.dusun} Dusun, ${masterStats.wilayahCount.rw} RW, ${masterStats.wilayahCount.rt} RT`,
      link: "/admin/manage-wilayah",
    },
    {
      id: 4,
      name: "Agama",
      icon: <FaPray className="text-red-500 text-3xl" />,
      description: "Kelola data keagamaan penduduk desa",
      category: "kategori",
      stats: "6 agama",
      link: "/admin/kelola-infografis/penduduk",
    },
    {
      id: 5,
      name: "Pekerjaan",
      icon: <FaBriefcase className="text-yellow-500 text-3xl" />,
      description: "Kelola jenis-jenis pekerjaan penduduk desa",
      category: "kategori",
      stats: "23 jenis pekerjaan",
      link: "/admin/kelola-infografis/penduduk",
    },
    {
      id: 6,
      name: "Pendidikan",
      icon: <FaGraduationCap className="text-teal-500 text-3xl" />,
      description: "Kelola tingkat pendidikan penduduk desa",
      category: "kategori",
      stats: "8 tier pendidikan",
      link: "/admin/kelola-infografis/penduduk",
    },
    {
      id: 7,
      name: "Perkembangan IDM",
      icon: <FaChartLine className="text-pink-500 text-3xl" />,
      description: "Pantau perkembangan Indeks Desa Membangun",
      category: "infografis",
      stats: "Tahap 3",
      link: "/admin/kelola-infografis/idm",
    },
    {
      id: 8,
      name: "Jenis Bantuan",
      icon: <MdVolunteerActivism className="text-orange-500 text-3xl" />,
      description:
        "Kelola jenis bantuan sosial yang diberikan untuk masyarakat kesejahteraan",
      category: "bantuan",
      stats: "12 jenis bantuan",
      link: "/admin/kelola-infografis/bansos",
    },
    {
      id: 9,
      name: "Kategori SDGs",
      icon: <GiProgression className="text-indigo-500 text-3xl" />,
      description: "Kelola data terkait Sustainable Development Goals",
      category: "infografis",
      stats: "17 goals",
      link: "/admin/kelola-infografis/sdgs",
    },
    {
      id: 10,
      name: "GIS Desa",
      icon: <FaMap className="text-blue-600 text-3xl" />,
      description: "Sistem Informasi Geografis wilayah desa",
      category: "infografis",
      stats: `${masterStats.wilayahCount.dusun} wilayah`,
      link: "/admin/gis-desa",
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

  const categories = [
    { id: "all", name: "Semua Data" },
    { id: "penduduk", name: "Data Penduduk" },
    { id: "wilayah", name: "Wilayah" },
    { id: "kategori", name: "Kategori" },
    { id: "bantuan", name: "Bantuan" },
    { id: "infografis", name: "Infografis" },
  ];

  const filteredData =
    activeCategory === "all"
      ? masterData
      : masterData.filter((item) => item.category === activeCategory);

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

        {/* Kategori Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Data Master Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="p-5 flex-grow">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-3 rounded-lg mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex justify-between items-center">
                  {/* <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {item.stats}
                  </span> */}
                  <button
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow transition-all duration-300"
                    onClick={() => navigate(item.link)}
                  >
                    <FaEdit />
                    Kelola Data
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 w-full mt-auto"></div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Total {filteredData.length} data master ditemukan • Terakhir
            diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
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
