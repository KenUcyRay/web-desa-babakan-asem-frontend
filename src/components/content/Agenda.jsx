import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarInfo from "../layout/SidebarInfo";
import Pagination from "../ui/Pagination";
import { FaCalendarAlt } from "react-icons/fa";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { alertError } from "../../libs/alert";
import { Helper } from "../../utils/Helper";

export default function Agenda() {
  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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
    setLoading(false);
  };

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
    <div className="bg-[#F8F8F8] w-full py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* KONTEN UTAMA */}
        <div className="md:col-span-3 space-y-4">
          {/* ✅ Judul ke kiri seperti berita */}
          <h1 className="text-3xl font-bold text-gray-800">
            Agenda Desa Babakan Asem
          </h1>

          {/* List Agenda */}
          {loading ? (
            <p className="text-center text-gray-500">
              ⏳ Sedang memuat agenda...
            </p>
          ) : agenda.length === 0 ? (
            <p className="text-center text-gray-500">
              📭 Belum ada agenda untuk ditampilkan.
            </p>
          ) : (
            agenda.map((item) => (
              <Link
                to={`/agenda/${item.agenda.id}`}
                key={item.agenda.id}
                className="block"
              >
                <div className="flex items-center bg-white border-l-4 border-green-500 rounded-lg p-3 shadow hover:shadow-md transition-all duration-200">
                  {/* Gambar agenda */}
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${
                      item.agenda.featured_image
                    }`}
                    alt={item.agenda.title}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.agenda.title}
                      </h2>
                      <span className="text-[11px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        {item.agenda.type || "Kegiatan"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mt-1">
                      {truncateText(item.agenda.content, 90)}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FaCalendarAlt className="text-green-500" />
                      {Helper.formatTanggal(item.agenda.published_at)} | 👁{" "}
                      {item.agenda.view_count} kali
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}

          {/* ✅ Pagination cuma muncul kalau totalPages > 1 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>

        {/* SIDEBAR */}
        <aside>
          <SidebarInfo />
        </aside>
      </div>
    </div>
  );
}
