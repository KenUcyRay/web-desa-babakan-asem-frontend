import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarInfo from "../layout/SidebarInfo";
import Pagination from "../ui/Pagination";
import { FaCalendarAlt } from "react-icons/fa";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { alertError } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import AOS from "aos";
import { useTranslation } from "react-i18next";
import "aos/dist/aos.css";

export default function Agenda() {
  const { t, i18n } = useTranslation();
  const [agenda, setAgenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const kategoriList = ["Semua", "REGULAR", "PKK", "KARANG_TARUNA", "BPD"];
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const fetchAgenda = async (
    page = currentPage,
    limit = 10,
    category = selectedCategory
  ) => {
    setLoading(true);
    try {
      const typeParam = category === "Semua" ? "" : category;
      const response = await AgendaApi.getAgenda(
        page,
        limit,
        typeParam,
        i18n.language
      );
      if (response.status === 200) {
        const responseBody = await response.json();
        // Fix tipe Karang Taruna menjadi format tampilan
        responseBody.agenda.forEach((item) => {
          if (item.agenda.type === "KARANG_TARUNA") {
            item.agenda.type = "Karang Taruna";
          }
        });
        setTotalPages(responseBody.total_page);
        setCurrentPage(responseBody.page);
        setAgenda(responseBody.agenda);
      } else {
        alertError(t("agenda.fetchError"));
      }
    } catch (error) {
      alertError(error.message);
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
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, [currentPage, selectedCategory, i18n.language]);

  return (
    <div className="bg-[#F8F8F8] w-full py-6 sm:py-8 md:py-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* KONTEN UTAMA */}
        <div className="md:col-span-3 space-y-4 sm:space-y-6">
          {/* Header judul */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              {t("agenda.title")}
            </h1>
          </div>

          {/* Filter Kategori */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
            {kategoriList.map((kategori) => (
              <button
                key={kategori}
                onClick={() => {
                  setSelectedCategory(kategori);
                  setCurrentPage(1);
                  fetchAgenda(1, 10, kategori);
                }}
                className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedCategory === kategori
                    ? "bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-800 shadow-md"
                    : "bg-white text-gray-600 border hover:bg-green-50 cursor-pointer"
                }`}
              >
                {t(`agenda.category.${kategori}`)}
              </button>
            ))}
          </div>

          {/* List Agenda */}
          {loading ? (
            <p className="text-center text-gray-500">{t("agenda.loading")}</p>
          ) : agenda.length === 0 ? (
            <p className="text-center text-gray-500">{t("agenda.empty")}</p>
          ) : (
            agenda.map((item, index) => (
              <Link
                to={`/agenda/${item.agenda.id}`}
                key={item.agenda.id}
                className="block"
              >
                <div className="relative rounded-lg shadow hover:shadow-md transition-all duration-200">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#9BEC00] to-[#D2FF72] rounded-l-lg"></div>
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center bg-white rounded-lg p-3 ml-1 gap-3 sm:gap-0"
                    data-aos="fade-left"
                    data-aos-delay={index * 100}
                  >
                    <img
                      src={`${
                        import.meta.env.VITE_NEW_BASE_URL
                      }/public/images/${item.agenda.featured_image}`}
                      alt={item.agenda.title}
                      className="w-full sm:w-20 md:w-24 h-32 sm:h-20 md:h-24 object-cover rounded-md sm:mr-4 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 sm:truncate">
                          {item.agenda.title}
                        </h2>
                        <span className="text-[10px] sm:text-[11px] px-2 py-0.5 bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-800 rounded-full whitespace-nowrap self-start sm:self-auto">
                          {item.agenda.type || "Kegiatan"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mt-1">
                        {truncateText(item.agenda.content, 90)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 flex-wrap">
                        <FaCalendarAlt className="text-green-500 flex-shrink-0" />
                        <span className="truncate">{Helper.formatTanggal(item.agenda.start_time)}</span>
                        <span>|</span>
                        <span className="flex items-center gap-1">
                          👁 {item.agenda.view_count} {t("agenda.viewCount")}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        {/* SIDEBAR */}
        <aside>
          <SidebarInfo />
        </aside>
      </div>
    </div>
  );
}
