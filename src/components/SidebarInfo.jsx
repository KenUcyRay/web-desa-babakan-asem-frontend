import berita1 from "../assets/berita1.jpeg";
import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaUsers, FaWhatsapp } from "react-icons/fa";

export default function SidebarInfo() {
  return (
    <div className="space-y-6">
      {/* ✅ Kartu Berita Terbaru */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">Berita Terbaru</h2>
        {[1, 2, 3, 4].map((i) => (
          <Link
            key={i}
            to={`/berita/${i}`} // 👉 langsung ke detail berita
            className="flex items-center mb-4 hover:bg-gray-50 p-2 rounded transition"
          >
            <img
              src={berita1}
              alt={`Berita ${i}`}
              className="w-12 h-12 object-cover rounded mr-3"
            />
            <div>
              <p className="text-sm font-semibold hover:text-green-600">
                Judul Berita {i}
              </p>
              <p className="text-xs text-gray-500">14/6/2025</p>
              <p className="text-xs text-gray-400">👁 Dilihat Sekian Kali</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ✅ Kartu Agenda Terbaru */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold text-lg mb-4 border-b pb-2">Agenda Terbaru</h2>
        {[1, 2, 3].map((i) => (
          <Link
            key={i}
            to={`/agenda/${i}`} // 👉 langsung ke detail agenda
            className="flex items-center mb-4 hover:bg-gray-50 p-2 rounded transition"
          >
            <img
              src={berita1}
              alt={`Agenda ${i}`}
              className="w-12 h-12 object-cover rounded mr-3"
            />
            <div>
              <p className="text-sm font-semibold hover:text-green-600">
                Judul Agenda {i}
              </p>
              <p className="text-xs text-gray-500">14/6/2025</p>
              <p className="text-xs text-gray-400">👁 Dilihat Sekian Kali</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ✅ Kartu Kontak Kami */}
      <div className="space-y-4">
        {/* WhatsApp */}
        <div className="bg-gradient-to-r from-[#B6F500] to-[#FFFCE2] p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-white p-2 rounded-full text-green-600">
            <FaWhatsapp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-xs text-gray-700">0812-3456-7890</p>
          </div>
        </div>

        {/* Telepon */}
        <div className="bg-gradient-to-r from-[#B6F500] to-[#FFFCE2] p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-white p-2 rounded-full text-green-600">
            <FaUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">Telepon</p>
            <p className="text-xs text-gray-700">(0261) 123456</p>
          </div>
        </div>

        {/* Email */}
        <div className="bg-gradient-to-r from-[#B6F500] to-[#FFFCE2] p-4 rounded-xl shadow flex items-center gap-4">
          <div className="bg-white p-2 rounded-full text-green-600">
            <HiOutlineMail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-xs text-gray-700">info@babakanasem.id</p>
          </div>
        </div>
      </div>
    </div>
  );
}
