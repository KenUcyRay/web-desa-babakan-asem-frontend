import SidebarInfo from "./SidebarInfo";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { GaleryApi } from "../libs/api/GaleryApi";
import { alertError } from "../libs/alert";

export default function Galery() {
  const [galery, setGalery] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGalery = async () => {
    const response = await GaleryApi.getGaleri(currentPage);
    if (response.status === 200) {
      const responseBody = await response.json();
      setTotalPages(responseBody.total_page);
      setCurrentPage(responseBody.page);
      setGalery(responseBody.galeri);
    } else {
      await alertError("Gagal mengambil data galeri. Silakan coba lagi nanti.");
    }
  };

  useEffect(() => {
    fetchGalery();
  }, [currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Galeri utama */}
      <div className="md:col-span-3 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Galeri Kegiatan Desa
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galery.map((img, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/galeri/images/${
                  img.image
                }`}
                alt={`Galeri ${i + 1}`}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* ✅ Pagination */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Sidebar */}
      <aside>
        <SidebarInfo />
      </aside>
    </div>
  );
}
