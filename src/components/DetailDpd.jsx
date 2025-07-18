import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

export default function DetailDpd() {
  const navigate = useNavigate();

  const agendaLengkap = [
    { judul: "Musyawarah Desa Bahas Pembangunan Jalan", tanggal: "20 Juli 2025", gambar: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800" },
    { judul: "Rapat Koordinasi Program Kesejahteraan", tanggal: "05 Agustus 2025", gambar: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800" },
    { judul: "Pengawasan Dana Desa Tahap II", tanggal: "15 Agustus 2025", gambar: "https://images.unsplash.com/photo-1581091215360-680f58a4576e?w=800" },
    { judul: "Dialog Aspirasi Warga Tahunan", tanggal: "30 Agustus 2025", gambar: "https://images.unsplash.com/photo-1551836022-4c4c79ecde16?w=800" },
    { judul: "Evaluasi Pembangunan Desa Semester II", tanggal: "15 September 2025", gambar: "https://images.unsplash.com/photo-1515165562835-c3b8fcf1d7c8?w=800" },
  ];

  const galeri = [
    { img: "https://images.unsplash.com/photo-1493815793585-d94ccbc86df8?w=800", desc: "Rapat koordinasi bersama warga desa membahas aspirasi pembangunan." },
    { img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800", desc: "Pengawasan realisasi dana desa tahap pertama." },
    { img: "https://images.unsplash.com/photo-1521790361557-168344a6f163?w=800", desc: "Kunjungan lapangan untuk memantau proyek jalan desa." },
    { img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800", desc: "Dialog interaktif bersama warga di balai desa." },
  ];

  return (
    <div className="font-poppins text-gray-800 w-full">
      {/* ✅ Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-yellow-50 w-full">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug">
            Agenda Lengkap & Galeri <span className="text-green-700">DPD</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Semua agenda mendatang serta dokumentasi kegiatan Dewan Perwakilan Desa Babakan Asem.
          </p>
        </div>
      </section>

      {/* ✅ Tombol Back ke halaman DPD */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 mt-4 flex">
        <button
          onClick={() => navigate("/dpd")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-green-900 font-semibold"
        >
          <HiArrowLeft className="text-xl" />
          Kembali ke DPD
        </button>
      </div>

      {/* ✅ Semua Agenda */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Daftar Agenda Lengkap</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agendaLengkap.map((ag, i) => (
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
      </section>

      {/* ✅ Galeri Kegiatan DPD */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Galeri Kegiatan DPD</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeri.map((g, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden w-full"
            >
              <img
                src={g.img}
                alt="Galeri DPD"
                className="w-full h-40 sm:h-48 md:h-56 object-cover"
              />
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
