import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarInfo from "../layout/SidebarInfo";
import Pagination from "../ui/Pagination";
import { FaCalendarAlt } from "react-icons/fa";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { alertError } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Agenda() {
  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // - Tambahkan state kategori
  const kategoriList = [
    "Semua",
    "REGULAR",
    "PKK",
    "KARANG_TARUNA",
    "DPD",
    "BPD",
  ];
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // - Fetch agenda support kategori
  const fetchAgenda = async (
    page = currentPage,
    limit = 10,
    category = selectedCategory
  ) => {
    setLoading(true);

    const typeParam = category === "Semua" ? "" : category;
    const response = await AgendaApi.getAgenda(page, limit, typeParam);

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
    fetchAgenda(currentPage, 10, selectedCategory);

    // - Inisialisasi AOS
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, [currentPage]);

  return (
    <div className="bg-[#F8F8F8] w-full py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* KONTEN UTAMA */}
        <div className="md:col-span-3 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Agenda Desa Babakan Asem
          </h1>

          {/* - FILTER KATEGORI */}
          <div className="flex flex-wrap gap-3 my-4">
            {kategoriList.map((kategori) => (
              <button
                key={kategori}
                onClick={() => {
                  setSelectedCategory(kategori);
                  setCurrentPage(1);
                  fetchAgenda(1, 10, kategori);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === kategori
                    ? "bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-800 shadow-md"
                    : "bg-white text-gray-700 border hover:bg-green-100"
                }`}
              >
                {kategori.replace("_", " ")}
              </button>
            ))}
          </div>

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
            agenda.map((item, index) => (
              <Link
                to={`/agenda/${item.agenda.id}`}
                key={item.agenda.id}
                className="block"
              >
                {/* Wrapper dengan border kiri gradasi */}
                <div className="relative rounded-lg shadow hover:shadow-md transition-all duration-200">
                  {/* Border kiri gradasi */}
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#9BEC00] to-[#D2FF72] rounded-l-lg"></div>

                  {/* Card utama */}
                  <div
                    className="flex items-center bg-white rounded-lg p-3 ml-1"
                    data-aos="fade-left"
                    data-aos-delay={index * 100}
                  >
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
                        <span className="text-[11px] px-2 py-0.5 bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-800 rounded-full">
                          {item.agenda.type || "Kegiatan"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mt-1">
                        {truncateText(item.agenda.content, 90)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <FaCalendarAlt className="text-green-500" />
                        {Helper.formatTanggal(item.agenda.start_time)} | 👁{" "}
                        {item.agenda.view_count} kali
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}

          {/* - Pagination cuma muncul kalau totalPages > 1 */}
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
