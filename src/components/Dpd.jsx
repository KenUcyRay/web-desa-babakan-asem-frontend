import React from "react";

export default function Dpd() {
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

  // ✅ Simpen data galeri (belum dipake)
  const galeri = [
    { img: "https://images.unsplash.com/photo-1493815793585-d94ccbc86df8?w=800", desc: "Rapat koordinasi bersama warga desa membahas aspirasi pembangunan." },
    { img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800", desc: "Pengawasan realisasi dana desa tahap pertama." },
    { img: "https://images.unsplash.com/photo-1521790361557-168344a6f163?w=800", desc: "Kunjungan lapangan untuk memantau proyek jalan desa." },
    { img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800", desc: "Dialog interaktif bersama warga di balai desa." },
  ];

  return (
    <div className="font-poppins text-gray-800">
      {/* ✅ HERO ala Dribbble */}
      <section className="relative bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Dewan Perwakilan Desa <span className="text-green-700">Babakan Asem</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-lg">
              Menampung aspirasi warga, mengawasi jalannya pemerintahan desa,
              serta memastikan pembangunan desa berjalan transparan.
            </p>
          </div>

          {/* Gambar */}
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800"
              alt="DPD Hero"
              className="rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ✅ Statistik ala card gede */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        <div className="bg-yellow-100 p-8 rounded-2xl shadow text-center hover:scale-105 transition">
          <h2 className="text-4xl font-bold text-yellow-700">6</h2>
          <p className="text-lg font-medium">Anggota Aktif</p>
        </div>
        <div className="bg-green-100 p-8 rounded-2xl shadow text-center hover:scale-105 transition">
          <h2 className="text-4xl font-bold text-green-700">3</h2>
          <p className="text-lg font-medium">Program Tahunan</p>
        </div>
        <div className="bg-blue-100 p-8 rounded-2xl shadow text-center hover:scale-105 transition">
          <h2 className="text-4xl font-bold text-blue-700">120+</h2>
          <p className="text-lg font-medium">Aspirasi Diterima</p>
        </div>
      </section>

      {/* ✅ Struktur Organisasi */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Struktur Organisasi
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {anggota.map((a, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center p-6"
            >
              <img
                src={a.foto}
                alt={a.nama}
                className="w-28 h-28 rounded-full mx-auto object-cover mb-4"
              />
              <h3 className="text-lg font-semibold">{a.nama}</h3>
              <p className="text-sm text-gray-500">{a.jabatan}</p>
              <p className="text-xs text-gray-400">Masa Jabatan 2023-2028</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Agenda ala Dribbble Card + CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">Agenda Mendatang</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {agenda.map((ag, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src={ag.gambar}
                alt={ag.judul}
                className="h-56 w-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">{ag.judul}</h3>
                <p className="text-sm opacity-80">{ag.tanggal}</p>
              </div>
            </div>
          ))}
        </div>
        {/* CTA */}
        <button className="px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition">
          Lihat Agenda Lengkap →
        </button>
      </section>

      {/* 
      ✅ Galeri disimpen tapi dikomen dulu
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Galeri Kegiatan DPD</h2>
        <div className="space-y-12">
          {galeri.map((g, i) => (
            <div key={i} className={`flex flex-col md:flex-row gap-6 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              <img src={g.img} alt="Galeri DPD" className="w-full md:w-1/2 rounded-xl shadow-lg" />
              <p className="flex-1 text-gray-700 text-lg leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </section> 
      */}
    </div>
  );
}
