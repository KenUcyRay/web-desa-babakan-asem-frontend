import SidebarInfo from "./SidebarInfo";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { NewsApi } from "../libs/api/NewsApi";

export default function Berita() {
  // const allBerita = Array.from({ length: 12 }, (_, i) => ({
  //   id: i + 1,
  //   judul: `Judul Berita ${i + 1}`,
  //   ringkasan: `Ringkasan isi berita singkat lorem ipsum dolor sit amet...`,
  //   img: berita1,
  // }));

  // const [currentPage, setCurrentPage] = useState(1);
  // const beritaPerPage = 6;
  // const indexOfLast = currentPage * beritaPerPage;
  // const indexOfFirst = indexOfLast - beritaPerPage;
  // const currentBerita = allBerita.slice(indexOfFirst, indexOfLast);
  // const totalPages = Math.ceil(allBerita.length / beritaPerPage);

  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNews = async () => {
    const response = await NewsApi.getNews(currentPage);
    if (response.status === 200) {
      const responseBody = await response.json();
      console.log(responseBody);
      console.log(responseBody.news);
      setTotalPages(responseBody.total_page);
      setCurrentPage(responseBody.page);
      setNews(responseBody.news);
    } else {
      await alertError("Gagal mengambil data news. Silakan coba lagi nanti.");
    }
  };

  const formatTanggal = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Bulan dimulai dari 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

          {/* Grid berita */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {news.map((n) => (
              <Link to={`/news/${n.news.id}`} key={n.news.id}>
                <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 h-full flex flex-col">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/news/images/${
                      n.news.featured_image
                    }`}
                    alt="Berita"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-lg font-bold mb-2">{n.news.title}</h2>
                  <p className="text-sm text-gray-700 flex-grow">
                    {n.news.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    🗓 {formatTanggal(n.news.created_at)} | 👁 Dilihat{" "}
                    {n.news.view_count} Kali
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
