import { FaUsers, FaSitemap, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { alertError } from "../../libs/alert";
import { useEffect, useState } from "react";
import { GaleryApi } from "../../libs/api/GaleryApi";

export default function StPkk() {
  const [galery, setGalery] = useState([]);

  const fetchGalery = async () => {
    const response = await GaleryApi.getGaleri(1, 8, "PKK");
    if (response.status === 200) {
      const responseBody = await response.json();
      setGalery(responseBody.galeri);
    } else {
      await alertError("Gagal mengambil data galeri. Silakan coba lagi nanti.");
    }
  };

  useEffect(() => {
    fetchGalery();
  }, []);

  return (
    <div className="font-poppins">
      {/* ✅ HERO: Judul + Foto Setengah */}
      <section className="relative w-full bg-gradient-to-r from-green-50 to-white py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-8 px-6">
          {/* Teks */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 leading-tight">
              Struktur & Galeri PKK Desa Babakan Asem
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              Mengenal lebih dekat susunan organisasi PKK dan dokumentasi
              kegiatan pemberdayaan keluarga di Desa Babakan Asem.
            </p>

            <Link
              to="/pkk"
              className="mt-4 inline-flex items-center gap-3 text-green-700 hover:text-green-900 font-semibold"
            >
              <FaArrowLeft /> Kembali ke Halaman PKK
            </Link>
          </div>

          {/* Gambar Hero */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000"
              alt="PKK Kegiatan"
              className="rounded-2xl shadow-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* ✅ STRUKTUR ORGANISASI */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Struktur Organisasi PKK
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Berikut adalah susunan struktur organisasi PKK Desa Babakan Asem yang
          terdiri dari Ketua, Sekretaris, Bendahara, dan Pokja I-IV.
        </p>

        {/* Struktur Diagram Sederhana */}
        <div className="flex flex-col gap-6 items-center">
          {/* Ketua */}
          <div className="bg-green-100 p-4 rounded-xl shadow-md w-72 text-center">
            <FaUsers className="mx-auto text-3xl text-green-700 mb-2" />
            <h3 className="font-bold text-lg">Ketua PKK</h3>
            <p className="text-sm text-gray-600">Nama Ketua PKK</p>
          </div>

          {/* Sekretaris & Bendahara */}
          <div className="flex flex-wrap justify-center gap-6">
            {["Sekretaris", "Bendahara"].map((role, i) => (
              <div
                key={i}
                className="bg-green-50 p-4 rounded-xl shadow w-56 text-center"
              >
                <FaSitemap className="mx-auto text-2xl text-green-600 mb-2" />
                <h4 className="font-semibold">{role}</h4>
                <p className="text-sm text-gray-600">Nama {role}</p>
              </div>
            ))}
          </div>

          {/* Pokja */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {["Pokja I", "Pokja II", "Pokja III", "Pokja IV"].map(
              (pokja, i) => (
                <div
                  key={i}
                  className="bg-white border p-4 rounded-lg shadow hover:shadow-md transition text-center"
                >
                  <h5 className="font-bold text-green-700">{pokja}</h5>
                  <p className="text-xs text-gray-600 mt-1">Ketua {pokja}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ✅ GALERI PKK */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-4">
          Galeri Kegiatan PKK
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Dokumentasi kegiatan PKK Desa Babakan Asem yang mencerminkan semangat
          kebersamaan dan pemberdayaan masyarakat.
        </p>

        {/* Grid Galeri */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galery.map((item) => (
            <div key={item.id} className="relative group">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/galeri/images/${
                  item.image
                }`}
                alt="Galeri PKK"
                className="rounded-xl shadow-md w-full h-48 object-cover group-hover:opacity-80 transition"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 text-white text-sm font-medium rounded-xl">
                Kegiatan PKK
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Kembali */}
        <div className="text-center mt-10">
          <Link
            to="/pkk"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:scale-105 transition shadow"
          >
            <FaArrowLeft /> Kembali ke Halaman PKK
          </Link>
        </div>
      </section>
    </div>
  );
}
