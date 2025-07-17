import { useParams } from "react-router-dom";
import SidebarInfo from "./SidebarInfo"; // Bisa diganti SidebarProduk kalau mau
import { FaWhatsapp } from "react-icons/fa";
import SidebarProduk from "./SIdebarProduk";

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
        <p className="text-sm text-gray-500 mb-6">
          Oleh BUMDes Babakan Asem | Harga:{" "}
          <span className="font-semibold text-black">{produk.harga}</span>
        </p>

        <div className="space-y-4 text-gray-800 leading-relaxed">
          <p>{produk.deskripsi}</p>
          <p>Produk ini 100% hasil desa dan dikelola oleh masyarakat lokal.</p>
        </div>

        {/* Tombol WA Pesan */}
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

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Nama"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300"
              required
            />
            <textarea
              placeholder="Tulis komentar kamu..."
              rows="4"
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
        </div>
      </div>

      {/* ✅ Sidebar */}
      <aside>
        <SidebarProduk />
      </aside>
    </div>
  );
}
