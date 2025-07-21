import { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../ui/Pagination";
import { ProductApi } from "../../libs/api/ProductApi";
import { Helper } from "../../utils/Helper";

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
      await alertError(
        "Gagal mengambil data product. Silakan coba lagi nanti."
      );
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [currentPage]);

  return (
    <div className="font-poppins bg-gray-50 min-h-screen">
      {/* ✅ Judul Atas */}
      <div className="bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Badan Usaha Milik Desa (BUMDes)
          </h1>
          <p className="text-gray-800 mt-2 max-w-2xl">
            Produk unggulan Desa Babakan Asem yang dikelola oleh masyarakat
            lokal.
          </p>
        </div>
      </div>

      {/* ✅ Grid Produk */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item) => {
            const full = Math.floor(item.average_rating);
            const half = item.average_rating - full >= 0.5;

            return (
              <div
                key={item.product.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {/* Klik gambar menuju detail */}
                <Link to={`/bumdes/${item.product.id}`}>
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/products/images/${
                      item.product.featured_image
                    }`}
                    alt={item.product.title}
                    className="w-full h-56 object-cover hover:opacity-90 transition"
                  />
                </Link>

                {/* Info Produk */}
                <div className="p-4 flex flex-col flex-grow">
                  <Link to={`/bumdes/${item.product.id}`}>
                    <h3 className="font-semibold text-lg text-gray-800 hover:underline">
                      {item.product.title}
                    </h3>
                  </Link>

                  {/* ✅ Rekap Rating (read-only) */}
                  <div className="flex items-center gap-1 mt-2">
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

                  {/* Harga + tombol WA */}
                  <div className="mt-auto flex justify-between items-center pt-4">
                    <p className="text-lg font-bold text-gray-900">
                      {Helper.formatRupiah(item.product.price)}
                    </p>
                    <a
                      href={item.product.link_whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded-lg transition"
                    >
                      <FaWhatsapp /> Pesan
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ Pagination */}
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* ✅ Footer */}
      <div className="bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-left">
          <h2 className="text-3xl font-bold text-gray-900">LUMBUNG DESA</h2>
          <p className="text-gray-800 mt-2 text-lg">
            Produk Asli Hasil Desa 100% – Mendukung Ekonomi Masyarakat Lokal
          </p>
        </div>
      </div>
    </div>
  );
}
