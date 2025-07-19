import { useState } from "react";
import {
  FaWhatsapp,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";

export default function DetailProduk() {
  const [rating, setRating] = useState(4.0); // rating saat ini
  const [tempRating, setTempRating] = useState(0); // rating yg dipilih user sebelum kirim
  const [showSubmit, setShowSubmit] = useState(false); // munculin tombol kirim
  const [comments, setComments] = useState([
    { user: "Budi", content: "Produk bagus sekali!", date: "2025-07-10" },
    { user: "Siti", content: "Packing rapi, pengiriman cepat!", date: "2025-07-15" },
  ]);

  const product = {
    title: "Beras Organik Premium",
    price: 75000,
    description:
      "Beras organik hasil panen petani desa, sehat tanpa bahan kimia.",
    image: "https://source.unsplash.com/800x400/?rice",
    whatsapp:
      "https://wa.me/6281234567890?text=Halo%20saya%20mau%20pesan%20Beras%20Organik",
  };

  // ✅ Saat klik bintang
  const handleSelectStar = (value) => {
    setTempRating(value);    // simpan sementara
    setShowSubmit(true);     // munculin tombol kirim
  };

  // ✅ Saat klik tombol kirim rating
  const handleSubmitRating = () => {
    setRating(tempRating);   // ganti rating produk
    setShowSubmit(false);    // sembunyikan tombol

    // Tambah komentar otomatis
    const newComment = {
      user: "Anda",
      content: `Saya memberi rating ⭐ ${tempRating} untuk produk ini`,
      date: new Date().toISOString().split("T")[0],
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ✅ Gambar Produk */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-80 object-cover rounded-lg shadow mb-4"
      />

      {/* ✅ Nama + Harga */}
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-gray-500">
        Harga:{" "}
        <span className="text-green-600 font-semibold">
          Rp {product.price.toLocaleString()}
        </span>
      </p>

      {/* ✅ Rating Produk */}
      <div className="mt-3">
        <p className="text-sm text-gray-600 mb-1">Rating Produk:</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            let icon;
            if (star <= full) {
              icon = <FaStar className="text-yellow-400" />;
            } else if (star === full + 1 && half) {
              icon = <FaStarHalfAlt className="text-yellow-400" />;
            } else {
              icon = <FaRegStar className="text-gray-300" />;
            }

            return (
              <span
                key={star}
                onClick={() => handleSelectStar(star)}
                className="cursor-pointer hover:scale-110 transition"
              >
                {icon}
              </span>
            );
          })}
          <span className="ml-2 text-sm text-gray-500">
            ({rating.toFixed(1)})
          </span>
        </div>

        {/* ✅ Kalau user pilih bintang → muncul tombol kirim */}
        {showSubmit && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleSubmitRating}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              ✅ Kirim Rating {tempRating} ⭐
            </button>
            <button
              onClick={() => {
                setTempRating(0);
                setShowSubmit(false);
              }}
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        )}
      </div>

      {/* ✅ Deskripsi */}
      <p className="mt-4 text-gray-700">{product.description}</p>

      {/* ✅ Tombol Pesan WA */}
      <div className="mt-6">
        <a
          href={product.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          <FaWhatsapp /> Pesan via WhatsApp
        </a>
      </div>

      {/* ✅ Komentar */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-3">💬 Komentar</h2>
        <div className="space-y-3">
          {comments.map((c, idx) => (
            <div key={idx} className="bg-white p-3 rounded shadow-sm">
              <p className="text-gray-800">{c.content}</p>
              <p className="text-xs text-gray-500">
                ✍ {c.user} • {c.date}
              </p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-400 text-center mt-4">
              Belum ada komentar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
