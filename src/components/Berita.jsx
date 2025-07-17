import SidebarInfo from "./SidebarInfo";
import berita1 from "../assets/berita1.jpeg";
import { Link } from "react-router-dom";
import { useState } from "react";
import Pagination from "./Pagination";

export default function Berita() {
  const allBerita = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    judul: `Judul Berita ${i + 1}`,
    ringkasan: `Ringkasan isi berita singkat lorem ipsum dolor sit amet...`,
    img: berita1,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const beritaPerPage = 6;
  const indexOfLast = currentPage * beritaPerPage;
  const indexOfFirst = indexOfLast - beritaPerPage;
  const currentBerita = allBerita.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allBerita.length / beritaPerPage);

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
            {currentBerita.map((berita) => (
              <Link to={`/berita/${berita.id}`} key={berita.id}>
                <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 h-full flex flex-col">
                  <img
                    src={berita.img}
                    alt="Berita"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-lg font-bold mb-2">{berita.judul}</h2>
                  <p className="text-sm text-gray-700 flex-grow">
                    {berita.ringkasan}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    🗓 14/6/2025 | 👁 Dilihat Sekian Kali
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
