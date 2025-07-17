import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarInfo from "./SidebarInfo";
import Pagination from "./Pagination"; // ✅ tambahkan ini
import berita1 from "../assets/berita1.jpeg";

export default function Agenda() {
  const allAgenda = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    judul: `Judul Agenda ${i + 1}`,
    deskripsi: `Deskripsi agenda singkat nomor ${i + 1}...`,
    img: berita1,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const agendaPerPage = 5; // tampil 5 agenda per halaman
  const indexOfLast = currentPage * agendaPerPage;
  const indexOfFirst = indexOfLast - agendaPerPage;
  const currentAgenda = allAgenda.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allAgenda.length / agendaPerPage);

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Judul halaman */}
        <div className="md:col-span-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Agenda Desa Babakan Asem
          </h1>
        </div>

        {/* Konten agenda (kiri) */}
        <div className="md:col-span-3 grid gap-y-4">
          {currentAgenda.map((agenda) => (
            <Link to={`/agenda/${agenda.id}`} key={agenda.id}>
              <div className="flex items-center bg-[#EDEDED] rounded-xl p-5 hover:shadow-md transition duration-200">
                <img
                  src={agenda.img}
                  alt="Agenda"
                  className="w-28 h-28 object-cover rounded-lg mr-6"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {agenda.judul}
                  </h2>
                  <p className="text-sm text-gray-700 mb-1 line-clamp-2">
                    {agenda.deskripsi}
                  </p>
                  <p className="text-xs text-gray-500">
                    🗓 14/6/2025 | 👁 Dilihat Sekian Kali
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

        {/* Sidebar (kanan) */}
        <aside>
          <SidebarInfo />
        </aside>
      </div>
    </div>
  );
}
