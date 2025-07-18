import berita1 from "../assets/berita1.jpeg";
import { useState } from "react";

export default function SidebarProduk() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="space-y-6">
      {/* Produk Lainnya */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">Produk Lainnya</h2>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setHovered(`produk-${i}`)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center mb-3 bg-gradient-to-r from-[#FFFCE2] to-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <img
                src={berita1}
                alt="produk"
                className="w-12 h-12 object-cover rounded-lg mr-3"
              />
              <div>
                <p className="text-sm font-semibold">Produk {i}</p>
                <p className="text-xs text-gray-500">Rp {i}0.000</p>
              </div>
            </div>

            {/* ✅ Dropdown penjelasan kecil */}
            <div
              className={`absolute left-0 top-full mt-1 w-full bg-white text-xs text-gray-600 p-2 rounded-md shadow-md transition-all duration-300 ${
                hovered === `produk-${i}`
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              Produk {i} dibuat oleh warga lokal, kualitas premium.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
