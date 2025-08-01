import React, { useState } from "react";
import { 
  FaEdit, 
  FaUsers, 
  FaIdCard, 
  FaMapMarkedAlt, 
  FaPray, 
  FaBriefcase, 
  FaGraduationCap, 
  FaHeart, 
  FaHandHoldingHeart, 
  FaUserAlt,
  FaNewspaper,
  FaCalendarAlt,
  FaTasks,
  FaImage,
  FaComments,
  FaEnvelope,
  FaFolderOpen,
  FaCog
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DataMaster() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Statistik untuk card bagian atas
  const statsData = [
    { id: 1, name: "Jumlah Berita", value: "5", icon: <FaNewspaper className="text-blue-500 text-xl" /> },
    { id: 2, name: "Jumlah Agenda", value: "10", icon: <FaCalendarAlt className="text-green-500 text-xl" /> },
    { id: 3, name: "Program Kerja", value: "0", icon: <FaTasks className="text-purple-500 text-xl" /> },
    { id: 4, name: "Galeri Desa", value: "1", icon: <FaImage className="text-red-500 text-xl" /> },
    { id: 5, name: "Pesan Masuk", value: "25", icon: <FaEnvelope className="text-yellow-500 text-xl" /> },
    { id: 6, name: "Pengguna", value: "120", icon: <FaUsers className="text-teal-500 text-xl" /> }
  ];

  // Data master utama
  const masterData = [
    { 
      id: 1, 
      name: "Data Penduduk", 
      icon: <FaUsers className="text-blue-500 text-3xl" />,
      description: "Kelola data seluruh penduduk desa secara komprehensif",
      category: "penduduk",
      stats: "1.245 data"
    },
    { 
      id: 2, 
      name: "Data KK", 
      icon: <FaIdCard className="text-green-500 text-3xl" />,
      description: "Kelola data jumlah kartu keluarga dan hubungan antar anggota keluarga",
      category: "penduduk",
      stats: "340 KK"
    },
    { 
      id: 3, 
      name: "Wilayah Dusun", 
      icon: <FaMapMarkedAlt className="text-purple-500 text-3xl" />,
      description: "Kelola pembagian wilayah administratif desa",
      category: "wilayah",
      stats: "4 Dusun, 12 RW, 36 RT"
    },
    { 
      id: 4, 
      name: "Agama", 
      icon: <FaPray className="text-red-500 text-3xl" />,
      description: "Kelola data keagamaan penduduk desa",
      category: "kategori",
      stats: "6 agama"
    },
    { 
      id: 5, 
      name: "Pekerjaan", 
      icon: <FaBriefcase className="text-yellow-500 text-3xl" />,
      description: "Kelola jenis-jenis pekerjaan penduduk desa",
      category: "kategori",
      stats: "23 jenis pekerjaan"
    },
    { 
      id: 6, 
      name: "Pendidikan", 
      icon: <FaGraduationCap className="text-teal-500 text-3xl" />,
      description: "Kelola tingkat pendidikan penduduk desa",
      category: "kategori",
      stats: "8 tingkat pendidikan"
    },
    { 
      id: 7, 
      name: "Status Perkawinan", 
      icon: <FaHeart className="text-pink-500 text-3xl" />,
      description: "Kelola status perkawinan penduduk desa",
      category: "kategori",
      stats: "5 status"
    },
    { 
      id: 8, 
      name: "Jenis Bantuan", 
      icon: <FaHandHoldingHeart className="text-orange-500 text-3xl" />,
      description: "Kelola jenis bantuan sosial yang diberikan",
      category: "bantuan",
      stats: "12 jenis bantuan"
    },
    { 
      id: 9, 
      name: "Kategori Lansia", 
      icon: <FaUserAlt className="text-indigo-500 text-3xl" />,
      description: "Kelola data penduduk lanjut usia",
      category: "penduduk",
      stats: "215 lansia"
    },
  ];

  // Aksi cepat
  const quickActions = [
    { 
      id: 1, 
      name: "Repository Dokumen", 
      icon: <FaFolderOpen className="text-white text-2xl" />,
      color: "from-blue-500 to-indigo-600",
      onClick: () => window.open("https://drive.google.com", "_blank")
    },
    { 
      id: 2, 
      name: "Kelola Pengguna", 
      icon: <FaUsers className="text-white text-2xl" />,
      color: "from-green-500 to-teal-600",
      onClick: () => navigate("/admin/manage-user")
    },
    { 
      id: 3, 
      name: "Kelola Pesan", 
      icon: <FaComments className="text-white text-2xl" />,
      color: "from-purple-500 to-pink-600",
      onClick: () => navigate("/admin/manage-pesan")
    }
  ];

  const categories = [
    { id: "all", name: "Semua Data" },
    { id: "penduduk", name: "Data Penduduk" },
    { id: "wilayah", name: "Wilayah" },
    { id: "kategori", name: "Kategori" },
    { id: "bantuan", name: "Bantuan" }
  ];

  const filteredData = activeCategory === "all" 
    ? masterData 
    : masterData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-blue-600">📋 Data Master</span> Desa
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kelola semua data dasar desa yang menjadi fondasi sistem informasi desa. 
            Data master digunakan sebagai referensi untuk berbagai fitur dan laporan.
          </p>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {statsData.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center hover:shadow-lg transition"
            >
              <div className="bg-blue-50 p-2 rounded-full mb-2">
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-700">{item.name}</h3>
              <p className="text-xl font-bold text-gray-800 mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Aksi Cepat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {quickActions.map(action => (
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
          {categories.map(category => (
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
          {filteredData.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-5">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-3 rounded-lg mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {item.stats}
                  </span>
                  <button 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow transition-all duration-300"
                    onClick={() => console.log(`Navigate to ${item.name}`)}
                  >
                    <FaEdit />
                    Kelola Data
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 w-full"></div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Total {filteredData.length} data master ditemukan • Terakhir diperbarui: 12 Juni 2023</p>
          <p className="mt-2">© 2023 Sistem Informasi Desa • Hak Cipta Dilindungi</p>
        </div>
      </div>
    </div>
  );
}