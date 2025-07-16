import SidebarInfo from "./SidebarInfo";
import berita1 from "../assets/berita1.jpeg";
import { Link } from "react-router-dom";

export default function Berita() {
  return (
    <div className="bg-[#F8F8F8] w-full py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* KONTEN UTAMA */}
        <div className="md:col-span-3 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Berita Desa Babakan Asem</h1>
          {/* Baris grid 2 kolom untuk card berita */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Link to={`/berita/${i}`} key={i}>
                <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 h-full flex flex-col">
                  <img
                    src={berita1}
                    alt="Berita"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-lg font-bold mb-2">Judul Berita {i}</h2>
                  <p className="text-sm text-gray-700 flex-grow">
                    Ringkasan isi berita singkat lorem ipsum dolor sit amet...
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    🗓 14/6/2025 | 👁 Dilihat Sekian Kali
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside>
          <SidebarInfo />
        </aside>
      </div>
    </div>
  );
}
