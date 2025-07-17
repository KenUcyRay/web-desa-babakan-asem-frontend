import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import berita1 from "../assets/berita1.jpeg";
import SidebarInfo from "./SidebarInfo";

export default function DetailBerita() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");

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
        <img src={berita1} alt="Detail Berita" className="w-full h-96 object-cover rounded-lg mb-6" />
        <h1 className="text-2xl font-bold mb-3">Judul Berita {id}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Oleh Admin | Tanggal: 08 Juni 2025 | 👁 20 Dilihat
        </p>

        <div className="space-y-4 text-gray-800 leading-relaxed">
          <p>Lorem ipsum dolor sit amet consectetur...</p>
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
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
              Kirim Komentar
            </button>
          </form>

          {/* ✅ List Komentar */}
          <div className="mt-6 space-y-4">
            {comments.map((c, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-700">{c.pesan}</p>
                <p className="text-xs text-gray-500 mt-1">✍ {c.nama} • {c.waktu}</p>
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
