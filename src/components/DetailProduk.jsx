import { useParams } from "react-router-dom";
import { FaWhatsapp, FaStar } from "react-icons/fa";
import { useState } from "react";
import SidebarProduk from "./SidebarProduk";

export default function DetailProduk() {
  const { id } = useParams();

  const produk = {
    id,
    nama: "Nama Produk Desa",
    harga: "Rp 65.000",
    deskripsi:
      "Ini adalah deskripsi lengkap produk desa. Bisa mencakup bahan, proses pembuatan, manfaat, dan informasi lainnya.",
    img: "https://picsum.photos/800/500?random=99",
  };

  // ✅ Komentar awal (contoh)
  const [komentarList, setKomentarList] = useState([
    {
      nama: "Budi",
      pesan: "Produk bagus!",
      rating: 5,
      tanggal: new Date("2025-07-15T14:20"),
    },
    {
      nama: "Sari",
      pesan: "Pengiriman cepat.",
      rating: 4,
      tanggal: new Date("2025-07-16T09:45"),
    },
  ]);
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [rating, setRating] = useState(0);

  // ✅ Hitung rata-rata rating
  const avgRating =
    komentarList.length > 0
      ? (
          komentarList.reduce((sum, k) => sum + k.rating, 0) / komentarList.length
        ).toFixed(1)
      : 0;

  // ✅ Format tanggal jadi "17 Juli 2025, 14:30"
  const formatTanggal = (date) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim() || rating === 0) return;

    const newKomentar = {
      nama,
      pesan,
      rating: Number(rating),
      tanggal: new Date(),
    };
    setKomentarList([...komentarList, newKomentar]);

    setNama("");
    setPesan("");
    setRating(0);
  };

  const renderStars = (value) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < value ? "text-yellow-400" : "text-gray-300"}
      />
    ));
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

        {/* ✅ Rata-rata rating */}
        <div className="flex items-center gap-2 mb-2">
          {renderStars(Math.round(avgRating))}
          <span className="text-sm text-gray-600">
            {avgRating} / 5.0 ({komentarList.length} ulasan)
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Oleh BUMDes Babakan Asem | Harga:{" "}
          <span className="font-semibold text-black">{produk.harga}</span>
        </p>

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
          <h2 className="text-xl font-semibold mb-4">💬 Tinggalkan Komentar & Rating</h2>

          {/* Form komentar */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300"
              required
            />
            <textarea
              placeholder="Tulis komentar kamu..."
              rows="4"
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300"
              required
            />

            {/* Pilih Rating */}
            <div>
              <label className="block font-medium mb-1">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border p-2 rounded-md"
                required
              >
                <option value={0}>Pilih rating...</option>
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Kirim Komentar
            </button>
          </form>

          {/* ✅ List komentar */}
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Komentar Pengguna</h3>
            {komentarList.length === 0 && (
              <p className="text-gray-500 text-sm">Belum ada komentar.</p>
            )}

            {komentarList.map((k, idx) => (
              <div key={idx} className="p-4 bg-white rounded-md shadow">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{k.nama}</p>
                  <span className="text-xs text-gray-400">
                    {formatTanggal(k.tanggal)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(k.rating)}
                  <span className="text-xs text-gray-500 ml-1">{k.rating}/5</span>
                </div>
                <p className="text-gray-700 mt-1">{k.pesan}</p>
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
  );
}
