import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { alertError } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import { GaleryApi } from "../../libs/api/GaleryApi";

export default function DetailDpd() {
  const navigate = useNavigate();

  const [agenda, setAgenda] = useState([]);
  const [galery, setGalery] = useState([]);

  const fetchGalery = async () => {
    const response = await GaleryApi.getGaleri(1, 100, "DPD");
    if (response.status === 200) {
      const responseBody = await response.json();
      setGalery(responseBody.galeri);
    } else {
      await alertError("Gagal mengambil data galeri. Silakan coba lagi nanti.");
    }
  };

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(1, 100, "DPD");
    if (response.status === 200) {
      const responseBody = await response.json();
      setAgenda(responseBody.agenda);
    } else {
      alertError("Gagal mengambil data agenda. Silakan coba lagi nanti.");
    }
  };

  useEffect(() => {
    fetchAgenda();
    fetchGalery();
  }, []);

  const handleBack = () => {
    // scroll ke atas dulu dengan smooth
    window.scrollTo({ top: 0, behavior: "smooth" });
    // kasih delay sedikit biar smooth keliatan
    setTimeout(() => navigate("/dpd"), 300);
  };

  return (
    <div className="font-poppins text-gray-800 w-full">
      {/* ✅ Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-yellow-50 w-full">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug">
            Agenda Lengkap & Galeri <span className="text-green-700">DPD</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Semua agenda mendatang serta dokumentasi kegiatan Dewan Perwakilan
            Desa Babakan Asem.
          </p>
        </div>
      </section>

      {/* ✅ Tombol Back ke halaman DPD */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 mt-4 flex">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-green-900 font-semibold"
        >
          <HiArrowLeft className="text-xl" />
          Kembali ke DPD
        </button>
      </div>

      {/* ✅ Semua Agenda */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Daftar Agenda Lengkap
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agenda.map((item) => (
            <div
              key={item.agenda.id}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition w-full"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${
                  item.agenda.featured_image
                }`}
                alt={item.agenda.title}
                className="h-40 sm:h-48 md:h-56 w-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-left text-white">
                <h3 className="font-bold text-sm sm:text-base md:text-lg">
                  {item.agenda.title}
                </h3>
                {(() => {
                  const { tanggal } = Helper.formatAgendaDateTime(
                    item.agenda.start_time,
                    item.agenda.end_time
                  );
                  return (
                    <p className="text-xs sm:text-sm opacity-80">{tanggal}</p>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Galeri Kegiatan DPD */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Galeri Kegiatan DPD
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden w-full"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/galeri/images/${
                  item.image
                }`}
                alt="Galeri DPD"
                className="w-full h-40 sm:h-48 md:h-56 object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
