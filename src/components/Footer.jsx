// components/Footer.jsx
import logo from "../assets/logo.png";
import { FaFacebookF, FaYoutube, FaGoogle, FaTwitter, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#3c3838] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Logo dan Alamat */}
        <div className="flex flex-col items-start">
          <img src={logo} alt="Logo Desa" className="w-20 mb-2" />
          <p className="text-lg font-semibold">Desa Babakan Asem</p>
          <p className="mt-2">
            Jalan Babakan Asem No. 142 Desa Babakan Asem,<br />
            Kecamatan Conggeang, Kabupaten Sumedang, <br />
            Jawa Barat 45391
          </p>
        </div>

        {/* Kontak */}
        <div>
          <p className="text-lg font-semibold mb-2">Hubungi Kami</p>
          <p className="flex items-center gap-2">
            📞 0853-3019-2025
          </p>
          <p className="flex items-center gap-2 mt-1">
            ✉️ Babakanasem@gmail.com
          </p>
        </div>

        {/* Layanan */}
        <div>
          <p className="text-lg font-semibold mb-2">Layanan</p>
          <p>Jumadi / Kades Kesik</p>
          <p>Yayan / Ambulans Kesik</p>
        </div>

        {/* Jelajahi */}
        <div>
          <p className="text-lg font-semibold mb-2">Jelajahi</p>
          <ul>
            <li>Website Kemendesa</li>
            <li>Website Kemendagri</li>
            <li>Website Sumedang</li>
            <li>Kartanegara</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-500 mt-8 pt-6 flex flex-col items-center">
        {/* Ikon Sosial Media */}
        <div className="flex gap-4 mb-4">
          <FaFacebookF className="text-2xl cursor-pointer hover:text-blue-500" />
          <FaYoutube className="text-2xl cursor-pointer hover:text-red-600" />
          <FaGoogle className="text-2xl cursor-pointer hover:text-yellow-500" />
          <FaTwitter className="text-2xl cursor-pointer hover:text-blue-400" />
          <FaTiktok className="text-2xl cursor-pointer hover:text-gray-300" />
        </div>
        <p className="text-sm">&copy; 2025 Desa Babakan Asem. All rights reserved.</p>
      </div>
    </footer>
  );
}
