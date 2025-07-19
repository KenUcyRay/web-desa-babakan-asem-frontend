import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { Helper } from "../../utils/Helper";

export default function KarangTaruna() {
  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(currentPage, 3, "KARANG_TARUNA");
    if (response.status === 200) {
      const responseBody = await response.json();
      setTotalPages(responseBody.total_page);
      setCurrentPage(responseBody.page);
      setAgenda(responseBody.agenda);
    } else {
      alertError("Gagal mengambil data agenda. Silakan coba lagi nanti.");
    }
    setLoading(false);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  useEffect(() => {
    fetchAgenda(currentPage);
  }, [currentPage]);

  return (
    <div className="bg-gray-50 py-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8">
      {/* ✅ Judul + Hero */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Karang Taruna Desa Babakan Asem
          </h1>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Pemuda Berkarya, Desa Berjaya. Karang Taruna Desa Babakan Asem
            adalah wadah pembinaan dan pengembangan generasi muda yang bergerak
            di bidang kesejahteraan sosial, kepemudaan, dan kemasyarakatan.
          </p>
        </div>
        <img
          src="https://picsum.photos/600/400?random=4"
          alt="Karang Taruna"
          className="rounded-xl shadow-lg w-full object-cover"
        />
      </div>

      {/* ✅ Visi & Misi */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#B6F500] p-6 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-xl font-bold text-black">Visi</h2>
          <p className="mt-2 text-black">
            Menjadi pemuda yang aktif, kreatif, dan peduli terhadap pembangunan
            desa.
          </p>
        </div>
        <div className="bg-orange-200 p-6 rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-xl font-bold text-gray-800">Misi</h2>
          <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
            <li>Mengembangkan potensi generasi muda</li>
            <li>Mengadakan kegiatan sosial dan budaya</li>
            <li>Menjadi penggerak kegiatan desa</li>
          </ul>
        </div>
      </div>

      {/* ✅ Struktur Organisasi */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-12">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Struktur Organisasi Karang Taruna
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Profil"
                className="w-20 h-20 rounded-full border-4 border-[#B6F500] shadow-md"
              />
              <p className="font-semibold mt-3">
                {i === 1 ? "H. Daryanto Sasmita" : "Nama Pengurus"}
              </p>
              <p className="text-sm text-gray-500">Jabatan</p>
              <p className="text-xs text-gray-400">2020 - 2026</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Dokumentasi Kegiatan */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Dokumentasi Kegiatan Karang Taruna
        </h2>
        <p className="text-gray-600 mb-6">
          Berikut beberapa kegiatan terbaru Karang Taruna Desa Babakan Asem.
        </p>

        {/* ✅ Card Kegiatan */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agenda.map((item) => (
            <div
              key={item.agenda.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <div className="w-full aspect-[4/3] overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${
                    item.agenda.featured_image
                  }`}
                  alt={item.agenda.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg">{item.agenda.title}</h3>
                {(() => {
                  const { tanggal, waktu } = Helper.formatAgendaDateTime(
                    item.agenda.start_time,
                    item.agenda.end_time
                  );
                  return (
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {item.agenda.location} <br />
                      📅 {tanggal} | ⏰ {waktu}
                    </p>
                  );
                })()}
                <p className="text-gray-600 text-sm mt-3">
                  {truncateText(item.agenda.content, 100)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination */}
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
