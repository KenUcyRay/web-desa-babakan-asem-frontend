import SidebarInfo from "./SidebarInfo";
import berita1 from "../assets/berita1.jpeg";
import { Link } from "react-router-dom";

export default function Agenda() {
  return (
    <div className="min-h-screen bg-[#F8F8F8] py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Judul halaman */}
        <div className="md:col-span-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Agenda Desa Babakan Asem
          </h1>
        </div>

        {/* Konten agenda (kiri) */}
        <div className="md:col-span-3 grid gap-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Link to={`/agenda/${i}`} key={i}>
              <div className="flex items-center bg-[#EDEDED] rounded-xl p-5 hover:shadow-md transition duration-200">
                <img
                  src={berita1}
                  alt="Agenda"
                  className="w-28 h-28 object-cover rounded-lg mr-6"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Judul Agenda {i}
                  </h2>
                  <p className="text-sm text-gray-700 mb-1 line-clamp-2">
                    Deskripsi agenda singkat di sini untuk agenda nomor {i}...
                  </p>
                  <p className="text-xs text-gray-500">
                    🗓 14/6/2025 | 👁 Dilihat Sekian Kali
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Sidebar (kanan) */}
        <aside>
          <SidebarInfo />
        </aside>
      </div>
    </div>
  );
}
