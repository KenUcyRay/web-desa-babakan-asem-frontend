import SidebarInfo from "../layout/SidebarInfo";
import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { alertError } from "../../libs/alert";
import { HiHome } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Galery() {
  const [galery, setGalery] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

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
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
        {/* ✅ Galeri Utama */}
        <div className="lg:col-span-3 w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Galeri Kegiatan Desa
          </h1>

          {/* ✅ Grid Galeri Auto-fit */}
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {galery.map((img, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="w-full aspect-[4/3] overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/galeri/images/${
                      img.image
                    }`}
                    alt={`Galeri ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* ✅ Sidebar */}
        <aside className="w-full">
          <SidebarInfo />
        </aside>
      </div>
    </div>
  );
}
