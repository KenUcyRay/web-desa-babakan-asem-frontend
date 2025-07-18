import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaTag } from "react-icons/fa";
import berita1 from "../assets/berita1.jpeg";
import SidebarInfo from "./SidebarInfo";

export default function DetailAgenda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [pesan, setPesan] = useState("");

  // ✅ Contoh detail agenda (bisa nanti diambil dari API)
  const agendaDetail = {
    judul: `Judul Agenda ${id}`,
    tanggal: "20 Juli 2025",
    jam: "09:00 - 12:00 WIB",
    lokasi: "Balai Desa Babakan Asem",
    status: "Akan Datang", // Bisa: Sedang Berlangsung / Selesai
    kategori: "Gotong Royong",
    deskripsi: `Ini adalah detail lengkap dari agenda ${id}, yang membahas kegiatan rutin warga desa untuk menjaga kebersihan lingkungan dan mempererat silaturahmi. Kegiatan ini terbuka untuk seluruh warga desa.`,
  };

  const handleKomentar = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("⚠ Silakan login dulu untuk memberikan komentar!");
      navigate("/login");
      return;
    }
    const now = new Date().toLocaleString();
    setComments([...comments, { nama: user.name, pesan, waktu: now }]);
    setPesan("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* ✅ Konten utama */}
      <div className="md:col-span-3">
        {/* Gambar Utama */}
        <img
          src={berita1}
          alt="Detail Agenda"
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        {/* Info Penting */}
        <div className="bg-green-50 p-5 rounded-lg shadow mb-6 border-l-4 border-green-500">
          <h1 className="text-3xl font-bold mb-3">{agendaDetail.judul}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <span className="flex items-center gap-2">
              <FaCalendarAlt className="text-green-600" /> {agendaDetail.tanggal}
            </span>
            <span className="flex items-center gap-2">
              <FaClock className="text-green-600" /> {agendaDetail.jam}
            </span>
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600" /> {agendaDetail.lokasi}
            </span>
            <span className="flex items-center gap-2">
              <FaTag className="text-green-600" /> {agendaDetail.kategori}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${agendaDetail.status === "Sedang Berlangsung" ? "bg-yellow-200 text-yellow-800" : agendaDetail.status === "Selesai" ? "bg-gray-200 text-gray-700" : "bg-green-200 text-green-700"}`}>
              {agendaDetail.status}
            </span>
          </div>
        </div>

        {/* Deskripsi Agenda */}
        <div className="space-y-4 text-gray-800 leading-relaxed bg-white p-6 rounded-lg shadow">
          <p>{agendaDetail.deskripsi}</p>
        </div>

        {/* ✅ Komentar */}
        <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">💬 Tinggalkan Komentar</h2>

          <form className="space-y-4" onSubmit={handleKomentar}>
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
                <p className="text-sm text-gray-700">{c.pesan}</p>
                <p className="text-xs text-gray-500 mt-1">
                  ✍ {c.nama} • {c.waktu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Sidebar */}
      <aside>
        <SidebarInfo />
      </aside>
    </div>
  );
}