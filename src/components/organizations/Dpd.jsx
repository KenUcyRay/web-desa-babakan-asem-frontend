import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

export default function Dpd() {
  const navigate = useNavigate();

  const anggota = [
    { nama: "Budi Santoso", jabatan: "Ketua DPD", foto: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400" },
    { nama: "Siti Aminah", jabatan: "Wakil Ketua", foto: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400" },
    { nama: "Rudi Hartono", jabatan: "Sekretaris", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
    { nama: "Dewi Lestari", jabatan: "Bendahara", foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400" },
  ];

  const agenda = [
    { judul: "Musyawarah Desa Bahas Pembangunan Jalan", tanggal: "20 Juli 2025", gambar: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800" },
    { judul: "Rapat Koordinasi Program Kesejahteraan", tanggal: "05 Agustus 2025", gambar: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800" },
    { judul: "Pengawasan Dana Desa Tahap II", tanggal: "15 Agustus 2025", gambar: "https://images.unsplash.com/photo-1581091215360-680f58a4576e?w=800" },
  ];

  return (
    <div className="font-poppins text-gray-800 w-full">
      {/* ✅ HERO Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-yellow-50 w-full">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Dewan Perwakilan Desa <span className="text-green-700">Babakan Asem</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
              Menampung aspirasi warga, mengawasi jalannya pemerintahan desa,
              serta memastikan pembangunan desa berjalan transparan.
            </p>
          </div>
          <div className="flex-1 min-w-0 w-full">
            <img
              src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800"
              alt="DPD Hero"
              className="rounded-2xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </section>
      {/* ✅ Statistik */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-yellow-100 p-8 rounded-2xl shadow text-center hover:scale-105 transition">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-700">6</h2>
          <p className="text-base md:text-lg font-medium">Anggota Aktif</p>
        </div>
        <div className="bg-green-100 p-8 rounded-2xl shadow text-center hover:scale-105 transition">
          <h2 className="text-3xl md:text-4xl font-bold text-green-700">3</h2>
          <p className="text-base md:text-lg font-medium">Program Tahunan</p>
        </div>
        <div className="bg-blue-100 p-8 rounded-2xl shadow text-center hover:scale-105 transition">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-700">120+</h2>
          <p className="text-base md:text-lg font-medium">Aspirasi Diterima</p>
        </div>
      </section>

      {/* ✅ Struktur Organisasi */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Struktur Organisasi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {anggota.map((a, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center p-6 w-full"
            >
              <img
                src={a.foto}
                alt={a.nama}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto object-cover mb-4"
              />
              <h3 className="text-base md:text-lg font-semibold">{a.nama}</h3>
              <p className="text-xs md:text-sm text-gray-500">{a.jabatan}</p>
              <p className="text-xs text-gray-400">Masa Jabatan 2023-2028</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Agenda Preview */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Agenda Mendatang</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {agenda.map((ag, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition w-full"
            >
              <img
                src={ag.gambar}
                alt={ag.judul}
                className="h-40 sm:h-48 md:h-56 w-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-left text-white">
                <h3 className="font-bold text-sm sm:text-base md:text-lg">{ag.judul}</h3>
                <p className="text-xs sm:text-sm opacity-80">{ag.tanggal}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Tombol ke Detail */}
        <button
          onClick={() => navigate("/detail-dpd")}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] shadow-md hover:shadow-lg hover:scale-105 transition font-semibold text-green-900"
        >
          Lihat Agenda Lengkap →
        </button>
      </section>
    </div>
  );
}
