import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaWhatsapp, FaStar } from "react-icons/fa";
import SidebarProduk from "./SidebarProduk";
import { Helper } from "../utils/Helper";
import { HiArrowLeft } from "react-icons/hi";

export default function DetailProduk() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Dummy produk
  const produk = {
    id,
    nama: "Nama Produk Desa",
    harga: "Rp 65.000",
    deskripsi:
      "Ini adalah deskripsi lengkap produk desa. Bisa mencakup bahan, proses pembuatan, manfaat, dan informasi lainnya.",
    img: "https://picsum.photos/800/500?random=99",
  };

  const [comments, setComments] = useState([]);
  const [pesan, setPesan] = useState("");
  const [rating, setRating] = useState(0);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleKomentar = (e) => {
    e.preventDefault();
    const newComment = {
      content: pesan,
      user: { name: "User Login" },
      updated_at: new Date().toISOString(),
    };
    setComments([newComment, ...comments]);
    setPesan("");
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      
      {/* ✅ Tombol Back ke Halaman Bumdes */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/bumdes")}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold 
          bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] shadow hover:shadow-lg hover:scale-105 transition"
        >
          <HiArrowLeft className="text-lg" /> Kembali ke BUMDes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ✅ Konten utama */}
        <div className="md:col-span-3">
          <img
            src={produk.img}
            alt={produk.nama}
            className="w-full h-96 object-cover rounded-lg mb-6 shadow"
          />
          <h1 className="text-3xl font-bold mb-3">{produk.nama}</h1>
          <p className="text-sm text-gray-500 mb-2">
            Oleh BUMDes Babakan Asem | Harga:{" "}
            <span className="font-semibold text-black">{produk.harga}</span>
          </p>

          {/* ✅ Rating Produk */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl transition ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleRating(star)}
              />
            ))}
            {rating > 0 && (
              <span className="text-sm text-gray-600">({rating} / 5)</span>
            )}
          </div>

          <div className="space-y-4 text-gray-800 leading-relaxed">
            <p>{produk.deskripsi}</p>
            <p>Produk ini 100% hasil desa dan dikelola oleh masyarakat lokal.</p>
          </div>

          {/* ✅ Tombol WA Pesan */}
          <div className="mt-6">
            <a
              href={`https://wa.me/6281234567890?text=Halo%20saya%20mau%20pesan%20${encodeURIComponent(
                produk.nama
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              <FaWhatsapp /> Pesan via WhatsApp
            </a>
          </div>

          {/* ✅ Komentar */}
          <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">💬 Tinggalkan Komentar</h2>

            <form onSubmit={handleKomentar} className="space-y-4">
              <textarea
                placeholder="Tulis komentar kamu..."
                rows="4"
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Kirim Komentar
              </button>
            </form>

            {/* ✅ List Komentar */}
            <div className="mt-6 space-y-4">
              {comments.map((c, i) => (
                <div key={i} className="p-4 bg-white rounded-lg shadow">
                  <p className="text-sm text-gray-700">{c.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ✍ {c.user.name} • {Helper.formatTanggal(c.updated_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Sidebar */}
        <aside>
          <SidebarProduk />
        </aside>
      </div>
    </div>
  );
}
