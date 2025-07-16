import { useState } from "react";
import { FaStar, FaWhatsapp } from "react-icons/fa";

export default function Bumdes() {
  const allProduk = [
    { id: 1, nama: "Beras Organik Premium", harga: "Rp 65.000", rating: 4.5, img: "https://picsum.photos/400/300?random=21" },
    { id: 2, nama: "Minyak Kelapa Asli", harga: "Rp 45.000", rating: 4, img: "https://picsum.photos/400/300?random=22" },
    { id: 3, nama: "Keripik Pisang Manis", harga: "Rp 20.000", rating: 5, img: "https://picsum.photos/400/300?random=23" },
    { id: 4, nama: "Madu Hutan Murni", harga: "Rp 80.000", rating: 4.8, img: "https://picsum.photos/400/300?random=24" },
    { id: 5, nama: "Gula Aren Asli", harga: "Rp 30.000", rating: 4.3, img: "https://picsum.photos/400/300?random=25" },
    { id: 6, nama: "Teh Herbal Desa", harga: "Rp 25.000", rating: 4.7, img: "https://picsum.photos/400/300?random=26" },
    { id: 7, nama: "Sabun Herbal Alami", harga: "Rp 18.000", rating: 4.1, img: "https://picsum.photos/400/300?random=27" },
    { id: 8, nama: "Kerajinan Tangan Bambu", harga: "Rp 120.000", rating: 4.9, img: "https://picsum.photos/400/300?random=28" },
    { id: 9, nama: "Beras Hitam Organik", harga: "Rp 70.000", rating: 4.4, img: "https://picsum.photos/400/300?random=29" },
  ];

  const [produk, setProduk] = useState(allProduk);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6; // ✅ 2 row x 3 kolom
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProduk = produk.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(produk.length / productsPerPage);

  const handleRating = (id, newRating) => {
    setProduk((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rating: newRating } : item
      )
    );
  };

  return (
    <div className="font-poppins bg-gray-50 min-h-screen">
      
      {/* ✅ Judul Atas langsung dalam kontainer hijau */}
      <div className="bg-[#B6F500] py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* ✅ Judul & Deskripsi jadi warna item */}
          <h1 className="text-4xl font-bold text-black text-left">
            Badan Usaha Milik Desa (BUMDes)
          </h1>
          <p className="text-black/80 mt-2 max-w-2xl text-left">
            Produk unggulan Desa Babakan Asem yang dikelola oleh masyarakat lokal.
            Belanja sambil mendukung ekonomi desa.
          </p>
        </div>
      </div>

      {/* ✅ Grid Produk */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentProduk.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={item.img}
                alt={item.nama}
                className="w-full h-56 object-cover"
              />

              {/* Info Produk */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-gray-800">{item.nama}</h3>

                {/* ✅ Rating Interaktif */}
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      onClick={() => handleRating(item.id, star)}
                      className={`cursor-pointer transition ${
                        star <= Math.round(item.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    ({item.rating.toFixed(1)})
                  </span>
                </div>

                {/* Bagian bawah harga + WA */}
                <div className="mt-auto flex justify-between items-center pt-4">
                  <p className="text-lg font-bold text-gray-900">{item.harga}</p>
                  <a
                    href={`https://wa.me/6281234567890?text=Halo%20saya%20mau%20pesan%20${encodeURIComponent(
                      item.nama
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded-lg transition"
                  >
                    <FaWhatsapp /> Pesan
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Pagination Interaktif */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded border transition ${
                currentPage === page
                  ? "bg-[#B6F500] text-black font-semibold"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Judul Bawah juga langsung di kontainer hijau */}
      <div className="bg-[#B6F500] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-left">
          {/* ✅ Judul & deskripsi bawah jadi hitam */}
          <h2 className="text-3xl font-bold text-black">
            LUMBUNG DESA
          </h2>
          <p className="text-black/80 mt-2 text-lg">
            Produk Asli Hasil Desa 100% – Mendukung Ekonomi Masyarakat Lokal
          </p>
        </div>
      </div>
    </div>
  );
}
