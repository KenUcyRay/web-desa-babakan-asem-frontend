import { useState } from "react";
import logo from "../assets/logo.png";

export default function NavbarTop() {
  const [openTentang, setOpenTentang] = useState(false);
  const [openInformasi, setOpenInformasi] = useState(false);

  return (
    <div className="w-full sticky top-0 bg-white shadow z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        
        {/* Logo besar */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo Desa" className="h-16 w-auto" />
          <div className="font-bold text-gray-800 text-lg">
            Desa Babakan Asem <br />
            <span className="text-sm font-normal text-gray-500">
              Kabupaten Sumedang
            </span>
          </div>
        </div>

        {/* Menu utama */}
        <div className="flex items-center gap-6 text-gray-700 font-medium relative">
          <a
            href="#beranda"
            className="hover:text-[#B6F500] transition"
          >
            Beranda
          </a>

          {/* Dropdown Tentang (klik toggle) */}
          <div className="relative">
            <button
              className="hover:text-[#B6F500] transition flex items-center gap-1"
              onClick={() => setOpenTentang(!openTentang)}
            >
              Tentang ▾
            </button>
            {openTentang && (
              <div className="absolute left-0 mt-2 w-48 bg-gradient-to-b from-[#B6F500] to-white border rounded shadow-md">
                <a
                  href="#profil"
                  className="block px-4 py-2 hover:text-[#B6F500] hover:bg-[#B6F500]/10 transition"
                >
                  Profil Desa
                </a>
                <a
                  href="#pemerintahan"
                  className="block px-4 py-2 hover:text-[#B6F500] hover:bg-[#B6F500]/10 transition"
                >
                  Pemerintahan
                </a>
                <a
                  href="#potensi"
                  className="block px-4 py-2 hover:text-[#B6F500] hover:bg-[#B6F500]/10 transition"
                >
                  Potensi Desa
                </a>
              </div>
            )}
          </div>

          <a
            href="#infografis"
            className="hover:text-[#B6F500] transition"
          >
            Infografis
          </a>

          {/* Dropdown Informasi (klik toggle juga biar sama) */}
          <div className="relative">
            <button
              className="hover:text-[#B6F500] transition flex items-center gap-1"
              onClick={() => setOpenInformasi(!openInformasi)}
            >
              Informasi ▾
            </button> 
            {openInformasi && (
              <div className="absolute left-0 mt-2 w-48 bg-gradient-to-b from-[#B6F500] to-white border rounded shadow-md">
                <a
                  href="#administrasi"
                  className="block px-4 py-2 hover:text-[#B6F500] hover:bg-[#B6F500]/10 transition"
                >
                  Administrasi
                </a>
                <a
                  href="#agenda"
                  className="block px-4 py-2 hover:text-[#B6F500] hover:bg-[#B6F500]/10 transition"
                >
                  Agenda
                </a>
                <a
                  href="#berita"
                  className="block px-4 py-2 hover:text-[#B6F500] hover:bg-[#B6F500]/10 transition"
                >
                  Berita
                </a>
              </div>
            )}
          </div>

          <a
            href="#kontak"
            className="hover:text-[#B6F500] transition"
          >
            Kontak Kami
          </a>

          {/* Tombol Masuk Gradient */}
          <button className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded hover:opacity-90 transition">
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
