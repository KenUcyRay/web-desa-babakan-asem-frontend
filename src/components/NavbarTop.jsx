import { useState } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/logo.png";

export default function NavbarTop() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // aktif jika anaknya aktif
  const isTentangActive = ["/profil", "/pemerintahan", "/potensi"].includes(location.pathname);
  const isInformasiActive = ["/administrasi", "/agenda", "/berita"].includes(location.pathname);

  const activeClass = "text-[#B6F500] font-semibold";
  const normalClass = "hover:text-[#B6F500] transition";

  return (
    <div className="w-full sticky top-0 bg-white shadow z-50 font-poppins">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* ✅ Logo klik ke home */}
        <Link to="/" className="flex items-center gap-4">
          <img src={logo} alt="Logo Desa" className="h-14 w-auto" />
          <div className="hidden sm:block font-bold text-gray-800 text-lg">
            Desa Babakan Asem <br />
            <span className="text-sm font-normal text-gray-500">
              Kabupaten Sumedang
            </span>
          </div>
        </Link>

        {/* ✅ MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium relative">
          
          <NavLink to="/" end className={({ isActive }) => isActive ? activeClass : normalClass}>Beranda</NavLink>

          {/* Dropdown Tentang (hover di desktop) */}
          <div className="relative group">
            <span className={`cursor-pointer flex items-center gap-1 ${isTentangActive ? activeClass : "hover:text-[#B6F500]"}`}>
              Tentang ▾
            </span>
            <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gradient-to-b from-[#B6F500] to-white rounded shadow-md z-50">
              <NavLink to="/profil" className="block px-4 py-2 text-black hover:underline">Profil Desa</NavLink>
              <NavLink to="/pemerintahan" className="block px-4 py-2 text-black hover:underline">Pemerintahan</NavLink>
              <NavLink to="/potensi" className="block px-4 py-2 text-black hover:underline">Potensi Desa</NavLink>
            </div>
          </div>

          <NavLink to="/infografis" className={({ isActive }) => isActive ? activeClass : normalClass}>Infografis</NavLink>

          {/* Dropdown Informasi */}
          <div className="relative group">
            <span className={`cursor-pointer flex items-center gap-1 ${isInformasiActive ? activeClass : "hover:text-[#B6F500]"}`}>
              Informasi ▾
            </span>
            <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gradient-to-b from-[#B6F500] to-white rounded shadow-md z-50">
              <NavLink to="/administrasi" className="block px-4 py-2 text-black hover:underline">Administrasi</NavLink>
              <NavLink to="/agenda" className="block px-4 py-2 text-black hover:underline">Agenda</NavLink>
              <NavLink to="/berita" className="block px-4 py-2 text-black hover:underline">Berita</NavLink>
            </div>
          </div>

          <NavLink to="/kontak" className={({ isActive }) => isActive ? activeClass : normalClass}>Kontak Kami</NavLink>

          {/* Tombol Masuk */}
          <NavLink to="/login" className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded hover:opacity-90 transition">
            Masuk
          </NavLink>
        </div>

        {/* ✅ HAMBURGER BUTTON (mobile) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-2xl text-gray-800"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* ✅ MENU MOBILE (slide down) */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-gradient-to-b from-white to-[#f7f7f7] text-gray-800">
          <NavLink to="/" end onClick={() => setMobileOpen(false)} className="hover:text-[#B6F500]">Beranda</NavLink>

          {/* Tentang (klik toggle) */}
          <details className="group">
            <summary className={`cursor-pointer ${isTentangActive ? "text-[#B6F500] font-semibold" : ""}`}>Tentang</summary>
            <div className="pl-4 mt-2 flex flex-col gap-2">
              <NavLink to="/profil" onClick={() => setMobileOpen(false)} className="hover:underline">Profil Desa</NavLink>
              <NavLink to="/pemerintahan" onClick={() => setMobileOpen(false)} className="hover:underline">Pemerintahan</NavLink>
              <NavLink to="/potensi" onClick={() => setMobileOpen(false)} className="hover:underline">Potensi Desa</NavLink>
            </div>
          </details>

          <NavLink to="/infografis" onClick={() => setMobileOpen(false)} className="hover:text-[#B6F500]">Infografis</NavLink>

          {/* Informasi */}
          <details className="group">
            <summary className={`cursor-pointer ${isInformasiActive ? "text-[#B6F500] font-semibold" : ""}`}>Informasi</summary>
            <div className="pl-4 mt-2 flex flex-col gap-2">
              <NavLink to="/administrasi" onClick={() => setMobileOpen(false)} className="hover:underline">Administrasi</NavLink>
              <NavLink to="/agenda" onClick={() => setMobileOpen(false)} className="hover:underline">Agenda</NavLink>
              <NavLink to="/berita" onClick={() => setMobileOpen(false)} className="hover:underline">Berita</NavLink>
            </div>
          </details>

          <NavLink to="/kontak" onClick={() => setMobileOpen(false)} className="hover:text-[#B6F500]">Kontak Kami</NavLink>

          <NavLink to="/login" onClick={() => setMobileOpen(false)} className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded text-center">
            Masuk
          </NavLink>
        </div>
      )}
    </div>
  );
}
