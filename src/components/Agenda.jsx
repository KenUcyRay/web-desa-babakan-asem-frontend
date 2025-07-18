import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarInfo from "./SidebarInfo";
import Pagination from "./Pagination";
import { FaCalendarAlt } from "react-icons/fa";
import { AgendaApi } from "../libs/api/AgendaApi";
import { alertError } from "../libs/alert";
import { Helper } from "../utils/Helper";

export default function Agenda() {
  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAgenda = async () => {
    const response = await AgendaApi.getAgenda(currentPage);
    if (response.status === 200) {
      const responseBody = await response.json();
      setTotalPages(responseBody.total_page);
      setCurrentPage(responseBody.page);
      setAgenda(responseBody.agenda);
    } else {
      alertError("Gagal mengambil data agenda. Silakan coba lagi nanti.");
    }
  };

  // ✅ Batasi deskripsi berita
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  useEffect(() => {
    fetchAgenda();
  }, [currentPage]);

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
          {agenda.map((item) => (
            <Link to={`/agenda/${item.agenda.id}`} key={item.agenda.id}>
              <div className="relative flex items-center bg-white border-l-4 border-green-500 rounded-xl p-5 shadow-sm hover:shadow-lg hover:scale-[1.01] transition duration-300">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${
                    item.agenda.featured_image
                  }`}
                  alt="Agenda"
                  className="w-28 h-28 object-cover rounded-lg mr-6"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.agenda.title}
                    </h2>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {item.agenda.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {truncateText(item.agenda.content)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FaCalendarAlt className="text-green-500" />
                    {Helper.formatTanggal(item.agenda.published_at)} | 👁 Dilihat{" "}
                    {item.agenda.view_count} Kali
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
