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
import foto1 from "../../assets/sponsor1.png";
import foto2 from "../../assets/sponsor2.png";
import foto3 from "../../assets/sponsor3.png";

export default function Footer() {
  return (
    <footer className="bg-[#2e2b2b] text-white w-full font-['Poppins',sans-serif]">
      {/* Bagian konten utama footer */}
      <div className="w-full px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        {/* ✅ Logo + Teks */}
        <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
          <Link to="/" className="group flex-shrink-0">
            <img
              src={logo}
              alt="Logo Desa"
              className="w-28 opacity-90 group-hover:opacity-100 transition duration-300"
            />
          </Link>
          <div className="md:text-left text-center">
            <p className="text-[17px] font-semibold tracking-wide">
              Desa Babakan Asem
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-400 hover:text-white transition duration-200">
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
          <p className="text-[17px] font-semibold mb-4 tracking-wide">
            Hubungi Kami
          </p>
          <p className="flex justify-center md:justify-start items-center gap-3 text-[15px] text-gray-300 hover:text-white hover:translate-x-1 transition-all">
            <FaPhone className="text-[#B6F500] text-[18px]" /> 0853-3019-2025
          </p>
          <p className="flex justify-center md:justify-start items-center gap-3 mt-3 text-[15px] text-gray-300 hover:text-white hover:translate-x-1 transition-all">
            <FaEnvelope className="text-[#B6F500] text-[18px]" />{" "}
            Babakanasem@gmail.com
          </p>
        </div>

        {/* ✅ Layanan */}
        <div className="md:text-left text-center">
          <p className="text-[17px] font-semibold mb-4 tracking-wide">
            Layanan
          </p>
          <p className="text-[15px] text-gray-300 hover:text-white hover:translate-x-1 transition-all">
            Jumadi / Kades Kesik
          </p>
          <p className="text-[15px] text-gray-300 hover:text-white hover:translate-x-1 transition-all mt-2">
            Yayan / Ambulans Kesik
          </p>
        </div>

        {/* ✅ Jelajahi */}
        <div className="md:text-left text-center">
          <p className="text-[17px] font-semibold mb-4 tracking-wide">
            Jelajahi
          </p>
          <ul className="space-y-2 text-[15px]">
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Website Kemendesa
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Website Kemendagri
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Website Sumedang
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
              >
                Kartanegara
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ Baris Sponsor */}
      <div className="border-t border-gray-700 py-8 flex flex-col items-center">
        <p className="mb-5 text-gray-300 font-medium text-sm uppercase tracking-wide">
          Didukung oleh
        </p>
        <div className="flex gap-16 flex-wrap justify-center">
          {[foto1, foto2, foto3].map((foto, idx) => (
            <a
              key={idx}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <img
                src={foto}
                alt={`Sponsor ${idx + 1}`}
                className="h-20 opacity-75 group-hover:opacity-100 group-hover:scale-105 transition duration-300"
              />
            </a>
          ))}
        </div>
      </div>

      {/* ✅ Sosial Media */}
      <div className="border-t border-gray-600 mt-8 pt-6 flex flex-col items-center">
        <div className="flex gap-7 mb-5 flex-wrap justify-center">
          {[
            { icon: <FaFacebookF />, color: "hover:text-blue-500" },
            { icon: <FaYoutube />, color: "hover:text-red-600" },
            { icon: <FaGoogle />, color: "hover:text-yellow-400" },
            { icon: <FaTwitter />, color: "hover:text-blue-400" },
            { icon: <FaTiktok />, color: "hover:text-gray-200" },
          ].map((sos, i) => (
            <a
              key={i}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[26px] opacity-75 hover:opacity-100 ${sos.color} transition-transform duration-300 hover:scale-110`}
            >
              {sos.icon}
            </a>
          ))}
        </div>
        <p className="text-[13px] opacity-80 text-center tracking-wide">
          &copy; 2025 Desa Babakan Asem. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
