import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaWhatsapp, FaStar } from "react-icons/fa";
import SidebarProduk from "./SidebarProduk";

export default function DetailProduk() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Cek login (simulasi)
  const isLoggedIn = localStorage.getItem("user");

  const produk = {
    id,
    nama: "Nama Produk Desa",
    harga: "Rp 65.000",
    deskripsi:
      "Ini adalah deskripsi lengkap produk desa. Bisa mencakup bahan, proses pembuatan, manfaat, dan informasi lainnya.",
    img: "https://picsum.photos/800/500?random=99",
  };

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newName, setNewName] = useState("");

  const [rating, setRating] = useState(0); // ⭐ rating yang dipilih
  const [userRated, setUserRated] = useState(false); // ✅ agar hanya sekali rating

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Silakan login dulu untuk memberi komentar!");
      navigate("/login");
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newEntry = {
      id: Date.now(),
      name: newName,
      text: newComment,
      date: `${formattedDate} - ${formattedTime}`,
    };

    setComments([newEntry, ...comments]);
    setNewComment("");
    setNewName("");
  };

  const handleRating = (value) => {
    if (!isLoggedIn) {
      alert("Silakan login dulu untuk memberi rating!");
      navigate("/login");
      return;
    }

    if (userRated) {
      alert("Anda sudah memberi rating untuk produk ini!");
      return;
    }

    setRating(value);
    setUserRated(true); // ✅ hanya boleh sekali
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* ✅ Konten utama */}
      <div className="md:col-span-3">
        <img
          src={produk.img}
          alt={produk.nama}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
        <h1 className="text-2xl font-bold mb-3">{produk.nama}</h1>
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

          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nama"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300"
              required
            />
            <textarea
              placeholder="Tulis komentar kamu..."
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
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
          {comments.length > 0 && (
            <div className="mt-6 space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-4 border rounded-lg bg-white shadow-sm"
                >
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.date}</p>
                  <p className="mt-2 text-gray-700">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Sidebar */}
      <aside>
        <SidebarProduk />
      </aside>
    </div>
  );
}
