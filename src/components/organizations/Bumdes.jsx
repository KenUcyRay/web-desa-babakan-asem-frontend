import { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../ui/Pagination";
import { ProductApi } from "../../libs/api/ProductApi";
import { Helper } from "../../utils/Helper";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Bumdes() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProduct = async () => {
    const response = await ProductApi.getProducts(currentPage);
    if (response.status === 200) {
      const responseBody = await response.json();
      setTotalPages(responseBody.total_page);
      setCurrentPage(responseBody.page);
      setProducts(responseBody.products);
    } else {
      await alertError("Gagal mengambil data product. Silakan coba lagi nanti.");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [currentPage]);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <div className="font-poppins bg-[#f7ffe5] min-h-screen">
      {/* ✅ HERO SECTION */}
      <div className="bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] py-16 text-center shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-sm"
            data-aos="fade-down"
          >
            Badan Usaha Milik Desa (BUMDes)
          </h1>
          <p
            className="text-gray-700 mt-4 text-lg leading-relaxed"
            data-aos="fade-up"
          >
            Produk unggulan Desa Babakan Asem yang dikelola oleh masyarakat
            lokal. Mendukung ekonomi mandiri & pemberdayaan desa.
          </p>
        </div>
      </div>

      {/* ✅ GRID PRODUK */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Belum ada produk yang tersedia.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((item, idx) => {
              const full = Math.floor(item.average_rating);
              const half = item.average_rating - full >= 0.5;

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col border border-green-100"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  {/* Gambar Produk */}
                  <Link to={`/bumdes/${item.product.id}`}>
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/products/images/${item.product.featured_image}`}
                      alt={item.product.title}
                      className="w-full h-56 object-cover rounded-t-xl hover:opacity-95 transition"
                    />
                  </Link>

                  {/* Info Produk */}
                  <div className="p-5 flex flex-col flex-grow">
                    <Link to={`/bumdes/${item.product.id}`}>
                      <h3 className="font-semibold text-lg text-gray-800 hover:text-green-700 transition">
                        {item.product.title}
                      </h3>
                    </Link>

                    {/* ⭐ Rating Produk */}
                    <div className="flex items-center gap-1 mt-3">
                      {[1, 2, 3, 4, 5].map((star) => {
                        let icon;
                        if (star <= full) {
                          icon = <FaStar className="text-yellow-400" />;
                        } else if (star === full + 1 && half) {
                          icon = <FaStarHalfAlt className="text-yellow-400" />;
                        } else {
                          icon = <FaRegStar className="text-gray-300" />;
                        }
                        return <span key={star}>{icon}</span>;
                      })}
                      <span className="text-sm text-gray-500 ml-2">
                        ({item.average_rating?.toFixed(1) ?? "0.0"})
                      </span>
                    </div>

                    {/* Harga & Pesan WA */}
                    <div className="mt-auto flex justify-between items-center pt-5">
                      <p className="text-xl font-bold text-green-700">
                        {Helper.formatRupiah(item.product.price)}
                      </p>
                      <a
                        href={item.product.link_whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg shadow hover:shadow-md transition"
                      >
                        <FaWhatsapp className="text-lg" />
                        Pesan
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ✅ PAGINATION */}
        {products.length > 0 && (
          <div className="mt-10 flex justify-center" data-aos="fade-up">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* ✅ FOOTER BUMDes */}
      <div className="bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] py-12 mt-12 text-center shadow-inner">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-900"
          data-aos="zoom-in"
        >
          🌱 Lumbung Ekonomi Desa
        </h2>
        <p
          className="text-gray-700 mt-3 text-lg max-w-2xl mx-auto"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          Semua produk di sini adalah hasil karya asli masyarakat Desa Babakan
          Asem – mendukung kemandirian & kesejahteraan warga.
        </p>
      </div>
    </div>
  );
}
