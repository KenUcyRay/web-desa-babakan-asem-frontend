import SidebarInfo from "../layout/SidebarInfo";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { NewsApi } from "../../libs/api/NewsApi";
import { Helper } from "../../utils/Helper";
import AOS from "aos";
import { useTranslation } from "react-i18next";
import "aos/dist/aos.css";

export default function Berita() {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchNews = async (page = 1, reset = false) => {
    if (loading) return;
    setLoading(true);
    
    const response = await NewsApi.getNews(page, 10, i18n.language);
    if (!response.ok) {
      setLoading(false);
      return;
    }
    
    const responseBody = await response.json();
    const newNews = responseBody.news;
    
    if (reset) {
      setNews(newNews);
      setCurrentPage(1);
    } else {
      setNews(prev => [...prev, ...newNews]);
    }
    
    setHasMore(page < responseBody.total_page);
    setLoading(false);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
      if (hasMore && !loading) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchNews(nextPage);
      }
    }
  }, [hasMore, loading, currentPage]);

  useEffect(() => {
    fetchNews(1, true);
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, [i18n.language]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="bg-[#F8F8F8] w-full py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* KONTEN UTAMA */}
        <div className="md:col-span-3 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {t("news.title")}
          </h1>

          {/* Grid daftar berita */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {news.map((n, index) => (
              <Link to={`/berita/${n.news.id}`} key={n.news.id}>
                <div
                  className="bg-white rounded-xl shadow hover:shadow-md transition p-4 h-full flex flex-col"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* Gambar Berita */}
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      n.news.featured_image
                    }`}
                    alt="Berita"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  {/* Judul */}
                  <h2 className="text-lg font-bold mb-2">{n.news.title}</h2>

                  {/* Deskripsi singkat + lihat detail */}
                  <p className="text-sm text-gray-700 flex-grow">
                    {truncateText(n.news.content, 100)}{" "}
                    <span className="text-green-600 font-semibold">
                      {t("news.readMore")}
                    </span>
                  </p>

                  {/* Info tanggal & view */}
                  <p className="text-xs text-gray-400 mt-2">
                    🗓 {Helper.formatTanggal(n.news.created_at)} | 👁{" "}
                    {t("news.viewed")} {n.news.view_count} {t("news.times")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}
          
          {!hasMore && news.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              {t("news.noMoreNews")}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="md:sticky md:top-4 md:h-fit">
          <SidebarInfo />
        </aside>
      </div>
    </div>
  );
}
