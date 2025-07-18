import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarInfo from "./SidebarInfo";
import Pagination from "./Pagination";
import { FaCalendarAlt } from "react-icons/fa";
import berita1 from "../assets/berita1.jpeg";

export default function Agenda() {
  // 🔥 Maksimal hanya 10 item (2 halaman)
  const maxItems = 10;

  const allAgenda = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    judul: `Judul Agenda ${i + 1}`,
    deskripsi: `Deskripsi agenda singkat nomor ${i + 1}, membahas kegiatan desa yang akan datang...`,
    img: berita1,
    kategori: i % 2 === 0 ? "Rapat" : "Gotong Royong",
    tanggal: "14/06/2025",
  })).slice(0, maxItems); // 👉 cuma ambil 10 data

  const [currentPage, setCurrentPage] = useState(1);
  const agendaPerPage = 5;
  const indexOfLast = currentPage * agendaPerPage;
  const indexOfFirst = indexOfLast - agendaPerPage;
  const currentAgenda = allAgenda.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allAgenda.length / agendaPerPage);

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Judul halaman */}
        <div className="md:col-span-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Agenda Desa Babakan Asem
          </h1>
          <p className="text-gray-500">Daftar kegiatan & acara desa terbaru</p>
        </div>

        {/* Konten agenda */}
        <div className="md:col-span-3 grid gap-y-4">
          {currentAgenda.map((agenda) => (
            <Link to={`/agenda/${agenda.id}`} key={agenda.id}>
              <div className="relative flex items-center bg-white border-l-4 border-green-500 rounded-xl p-5 shadow-sm hover:shadow-lg hover:scale-[1.01] transition duration-300">
                <img
                  src={agenda.img}
                  alt="Agenda"
                  className="w-28 h-28 object-cover rounded-lg mr-6"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {agenda.judul}
                    </h2>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {agenda.kategori}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {agenda.deskripsi}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FaCalendarAlt className="text-green-500" /> {agenda.tanggal} | 👁 Dilihat Sekian Kali
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {/* ✅ Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        {/* Sidebar */}
        <aside>
          <SidebarInfo />
        </aside>
      </div>
    </div>
  );
}
