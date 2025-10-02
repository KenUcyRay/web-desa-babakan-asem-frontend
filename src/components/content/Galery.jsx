import SidebarInfo from "../layout/SidebarInfo";
import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { alertError } from "../../libs/alert";
import AOS from "aos";
import { useTranslation } from "react-i18next";
import "aos/dist/aos.css";

export default function Galery() {
  const { t, i18n } = useTranslation();
  const [galery, setGalery] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGalery = async () => {
    const response = await GaleryApi.getGaleri(currentPage, 12, i18n.language);
    if (!response.ok) {
      return;
    }

    const responseBody = await response.json();
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.page);
    setGalery(responseBody.galeri);
  };

  useEffect(() => {
    fetchGalery();
  }, [currentPage, i18n.language]);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-10 font-poppins">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
        {/* - Galeri Utama */}
        <div className="lg:col-span-3 w-full">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-center md:text-left mb-10 bg-gradient-to-r from-[#000000] to-[#ffffff] bg-clip-text text-transparent"
            data-aos="fade-down"
          >
            {t("galery.title")}
          </h1>

          {/* - Grid Galeri Auto-fit */}
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {galery.map((img, idx) => (
              <div
                key={img.image}
                className="bg-white rounded-xl overflow-hidden shadow-md transition duration-300"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      img.image
                    }`}
                    alt={`Galeri ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* - Pagination */}
          <div className="mt-10 flex justify-end" data-aos="fade-up">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* - Sidebar */}
        <aside className="w-full" data-aos="fade-left">
          <SidebarInfo />
        </aside>
      </div>
    </div>
  );
}
