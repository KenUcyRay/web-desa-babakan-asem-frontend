import SidebarInfo from "./SidebarInfo";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { NewsApi } from "../libs/api/NewsApi";

export default function Berita() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNews = async () => {
    const response = await NewsApi.getNews(currentPage);
    if (response.status === 200) {
      const responseBody = await response.json();
      setTotalPages(responseBody.total_page);
      setCurrentPage(responseBody.page);
      setNews(responseBody.news);
    } else {
      alert("Gagal mengambil data berita. Silakan coba lagi nanti.");
    }
  };

  const formatTanggal = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ✅ Batasi deskripsi berita
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  return (
    <div className="bg-[#F8F8F8] w-full py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* KONTEN UTAMA */}
        <div className="md:col-span-3 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Berita Desa Babakan Asem
          </h1>

          {/* Grid daftar berita */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {news.map((n) => (
              <Link to={`/berita/${n.news.id}`} key={n.news.id}>
                <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 h-full flex flex-col">
                  {/* Gambar Berita */}
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/news/images/${n.news.featured_image}`}
                    alt="Berita"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  {/* Judul */}
                  <h2 className="text-lg font-bold mb-2">{n.news.title}</h2>

                  {/* Deskripsi singkat + lihat detail */}
                  <p className="text-sm text-gray-700 flex-grow">
                    {truncateText(n.news.content, 100)}{" "}
                    <span className="text-green-600 font-semibold">
                      Lihat detail →
                    </span>
                  </p>

                  {/* Info tanggal & view */}
                  <p className="text-xs text-gray-400 mt-2">
                    🗓 {formatTanggal(n.news.created_at)} | 👁{" "}
                    {n.news.view_count} kali
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* ✅ Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
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
