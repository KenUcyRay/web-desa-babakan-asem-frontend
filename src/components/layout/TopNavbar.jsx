import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function TopNavbar() {
  return (
    <div className="w-full fixed top-0 left-0 bg-white shadow z-50">
      <div className="w-full flex flex-wrap items-center justify-between px-6 xl:px-16 py-3 text-xs sm:text-sm font-medium text-gray-700">
        
        {/* ✅ Menu kiri dengan scroll horizontal di mobile */}
        <div className="flex gap-6 justify-start w-full sm:w-auto overflow-x-auto scrollbar-hide">
          <Link to="/pkk" className="whitespace-nowrap hover:text-[#B6F500] transition">
            PKK
          </Link>
          <Link to="/bumdes" className="whitespace-nowrap hover:text-[#B6F500] transition">
            BUMDES
          </Link>
          <Link to="/karang-taruna" className="whitespace-nowrap hover:text-[#B6F500] transition">
            Karang Taruna
          </Link>
          <Link to="/galeri" className="whitespace-nowrap hover:text-[#B6F500] transition">
            Galeri
          </Link>
          <Link to="/dpd" className="whitespace-nowrap hover:text-[#B6F500] transition font-semibold">
            DPD
          </Link>
          <Link to="/bpd" className="whitespace-nowrap hover:text-[#B6F500] transition font-semibold">
            BPD
          </Link>
        </div>

        {/* ✅ Sosmed */}
        <div className="flex items-center gap-5 justify-center w-full sm:w-auto mt-2 sm:mt-0">
          <a
            href="https://www.facebook.com/KpuSumedangKab/?locale=id_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 transition"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/inimahsumedang/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-500 transition"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@bpskabsumedang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-black transition"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=6281122202220&text=Simpati"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-green-500 transition"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-red-500 transition"
            aria-label="Gmail"
          >
            <MdEmail />
          </a>
        </div>
      </div>
    </div>
  );
}
