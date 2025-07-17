import { useParams } from "react-router-dom";
import berita1 from "../assets/berita1.jpeg";
import SidebarInfo from "./SidebarInfo";

export default function DetailAgenda() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* ✅ Konten utama */}
      <div className="md:col-span-3">
        <img
          src={berita1}
          alt="Detail Agenda"
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
        <h1 className="text-2xl font-bold mb-3">
          Judul Agenda {id}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Oleh Admin | Tanggal: 14 Juni 2025 | 🗓 Lokasi Balai Desa | 👁 15 Dilihat
        </p>

        <div className="space-y-4 text-gray-800 leading-relaxed">
          <p>
            Ini adalah detail lengkap dari agenda {id}. Kegiatan ini diadakan untuk mendukung program desa.
          </p>
          <p>
            Lokasi pelaksanaan berada di Balai Desa Babakan Asem. Warga diundang untuk berpartisipasi.
          </p>
          <p>
            Harap hadir tepat waktu dan membawa perlengkapan yang diperlukan.
          </p>
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
        <SidebarInfo />
      </aside>
    </div>
  );
}
