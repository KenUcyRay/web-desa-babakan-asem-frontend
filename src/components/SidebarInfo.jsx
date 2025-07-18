import berita1 from "../assets/berita1.jpeg";
import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaUsers, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

export default function SidebarInfo() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="space-y-6">
      {/* ✅ Kartu Berita Terbaru */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">Berita Terbaru</h2>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setHovered(`berita-${i}`)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link
              to={`/berita/${i}`}
              className="flex items-center mb-3 bg-gradient-to-r from-[#FFFCE2] to-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <img
                src={berita1}
                alt={`Berita ${i}`}
                className="w-12 h-12 object-cover rounded-lg mr-3"
              />
              <div>
                <p className="text-sm font-semibold hover:text-green-600">
                  Judul Berita {i}
                </p>
                <p className="text-xs text-gray-500">14/6/2025</p>
              </div>
            </Link>

            {/* ✅ Dropdown penjelasan kecil */}
            <div
              className={`absolute left-0 top-full mt-1 w-full bg-white text-xs text-gray-600 p-2 rounded-md shadow-md transition-all duration-300 ${
                hovered === `berita-${i}`
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              Ringkasan singkat berita {i} untuk gambaran umum.
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Kartu Agenda Terbaru */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">Agenda Terbaru</h2>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setHovered(`agenda-${i}`)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link
              to={`/agenda/${i}`}
              className="flex items-center mb-3 bg-gradient-to-r from-[#FFFCE2] to-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <img
                src={berita1}
                alt={`Agenda ${i}`}
                className="w-12 h-12 object-cover rounded-lg mr-3"
              />
              <div>
                <p className="text-sm font-semibold hover:text-green-600">
                  Judul Agenda {i}
                </p>
                <p className="text-xs text-gray-500">14/6/2025</p>
              </div>
            </Link>

            {/* ✅ Dropdown penjelasan kecil */}
            <div
              className={`absolute left-0 top-full mt-1 w-full bg-white text-xs text-gray-600 p-2 rounded-md shadow-md transition-all duration-300 ${
                hovered === `agenda-${i}`
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              Deskripsi singkat agenda {i} yang akan datang.
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Kartu Kontak Kami */}
      <div className="space-y-4">
        {[
          { icon: <FaWhatsapp className="w-6 h-6" />, label: "WhatsApp", value: "0812-3456-7890" },
          { icon: <FaUsers className="w-6 h-6" />, label: "Telepon", value: "(0261) 123456" },
          { icon: <HiOutlineMail className="w-6 h-6" />, label: "Email", value: "info@babakanasem.id" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-[#B6F500] to-[#FFFCE2] p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center gap-4"
          >
            <div className="bg-white p-2 rounded-full text-green-600">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-gray-700">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
