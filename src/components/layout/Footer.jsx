import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  FaFacebookF,
  FaYoutube,
  FaGoogle,
  FaTwitter,
  FaTiktok,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#3c3838] text-white w-full">
      {/* Bagian konten utama footer */}
      <div
        className="
          w-full px-6 py-12 
          grid grid-cols-1 md:grid-cols-4 gap-8 text-sm
        "
      >
        {/* ✅ Logo + Teks */}
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <Link to="/" className="group flex-shrink-0">
            <img
              src={logo}
              alt="Logo Desa"
              className="w-24 opacity-80 group-hover:opacity-100 transition duration-300"
            />
          </Link>
          <div className="md:text-left text-center">
            <p className="text-[16px] font-semibold">Desa Babakan Asem</p>
            <p className="mt-1 text-[13px] leading-snug text-gray-400 hover:text-white transition duration-200">
              Jalan Babakan Asem No. 142 Desa Babakan Asem,
              <br />
              Kecamatan Conggeang, Kabupaten Sumedang,
              <br />
              Jawa Barat 45391
            </p>
          </div>
        </div>

        {/* ✅ Hubungi Kami */}
        <div className="md:text-left text-center">
          <p className="text-[16px] font-semibold mb-3">Hubungi Kami</p>
          <p className="flex justify-center md:justify-start items-center gap-2 text-[14px] text-gray-400 hover:text-white hover:underline transition">
            <FaPhone className="text-[#B6F500]" /> 0853-3019-2025
          </p>
          <p className="flex justify-center md:justify-start items-center gap-2 mt-2 text-[14px] text-gray-400 hover:text-white hover:underline transition">
            <FaEnvelope className="text-[#B6F500]" /> Babakanasem@gmail.com
          </p>
        </div>

        {/* ✅ Layanan */}
        <div className="md:text-left text-center">
          <p className="text-[16px] font-semibold mb-3">Layanan</p>
          <p className="text-[14px] text-gray-400 hover:text-white hover:underline transition">
            Jumadi / Kades Kesik
          </p>
          <p className="text-[14px] text-gray-400 hover:text-white hover:underline transition">
            Yayan / Ambulans Kesik
          </p>
        </div>

        {/* ✅ Jelajahi */}
        <div className="md:text-left text-center">
          <p className="text-[16px] font-semibold mb-3">Jelajahi</p>
          <ul className="space-y-1 text-[14px]">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white hover:underline transition"
              >
                Website Kemendesa
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white hover:underline transition"
              >
                Website Kemendagri
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white hover:underline transition"
              >
                Website Sumedang
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white hover:underline transition"
              >
                Kartanegara
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ Garis + Sosial Media */}
      <div className="border-t border-gray-500 mt-8 pt-6 flex flex-col items-center">
        <div className="flex gap-6 mb-4 flex-wrap justify-center">
          <a
            href="#"
            className="text-2xl opacity-70 hover:opacity-100 hover:text-blue-500 transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="text-2xl opacity-70 hover:opacity-100 hover:text-red-600 transition"
          >
            <FaYoutube />
          </a>
          <a
            href="#"
            className="text-2xl opacity-70 hover:opacity-100 hover:text-yellow-400 transition"
          >
            <FaGoogle />
          </a>
          <a
            href="#"
            className="text-2xl opacity-70 hover:opacity-100 hover:text-blue-400 transition"
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            className="text-2xl opacity-70 hover:opacity-100 hover:text-gray-300 transition"
          >
            <FaTiktok />
          </a>
        </div>
        <p className="text-sm opacity-80 text-center">
          &copy; 2025 Desa Babakan Asem. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
