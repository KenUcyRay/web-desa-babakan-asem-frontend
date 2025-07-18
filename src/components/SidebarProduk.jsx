import berita1 from "../assets/berita1.jpeg";
import { useEffect, useState } from "react";
import { ProductApi } from "../libs/api/ProductApi";
import { Helper } from "../utils/Helper";
import { Link } from "react-router";

export default function SidebarProduk() {
  const [products, setProducts] = useState([]);

  const fetchProduct = async () => {
    const response = await ProductApi.getProducts(1, 4);
    if (response.status === 200) {
      const responseBody = await response.json();
      setProducts(responseBody.products);
    } else {
      await alertError(
        "Gagal mengambil data product. Silakan coba lagi nanti."
      );
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="space-y-6">
      {/* Produk Lainnya */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">Produk Lainnya</h2>
        {products.map((item) => (
          <div key={item.product.id} className="relative">
            <Link
              to={`/bumdes/${item.product.id}`}
              className="flex items-center mb-3 bg-gradient-to-r from-[#FFFCE2] to-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/products/images/${
                  item.product.featured_image
                }`}
                alt={item.product.title}
                className="w-12 h-12 object-cover rounded-lg mr-3"
              />
              <div>
                <p className="text-sm font-semibold">{item.product.title}</p>
                <p className="text-xs text-gray-500">
                  {Helper.formatRupiah(item.product.price)}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
