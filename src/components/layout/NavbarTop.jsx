import { useState } from "react";
import { useLocation, NavLink, Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa"; // ✅ ikon user
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { alertConfirm, alertSuccess } from "../../libs/alert";

export default function NavbarTop() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const { isLoggedIn, logout, isAdmin, setAdminStatus } = useAuth();

  const isTentangActive = ["/profil", "/pemerintahan", "/potensi"].includes(
    location.pathname
  );
  const isInformasiActive = ["/administrasi", "/agenda", "/berita"].includes(
    location.pathname
  );

  const activeClass = "text-[#B6F500] font-semibold";
  const normalClass = "hover:text-[#B6F500] transition";

  const handleLogout = async () => {
    const confirm = await alertConfirm("Apakah Anda yakin ingin keluar?");
    if (!confirm) return;

    setAdminStatus(false);
    logout();
    await alertSuccess("Anda telah keluar.");
    setAvatarMenuOpen(false);
    navigate("/login"); // setelah logout balik ke home
  };

  const goProfile = () => {
    setAvatarMenuOpen(false);
    navigate("/profile");
  };

  const userMenu = () => {
    if (isAdmin) {
      // kalau admin langsung dashboard
      return (
        <Link
          to="/admin"
          className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          Dashboard Admin
        </Link>
      );
    }

    return (
      <div className="relative">
        {/* ✅ Avatar Icon */}
        <button
          onClick={() => setAvatarMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-[#B6F500] transition"
        >
          <FaUserCircle size={28} />
        </button>

        {/* ✅ Dropdown Menu */}
        {avatarMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded-md py-2 z-50">
            <button
              onClick={goProfile}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Profil Saya
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  const button = () => {
    if (isLoggedIn) {
      return userMenu();
    } else {
      return (
        <NavLink
          to="/login"
          className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          Masuk
        </NavLink>
      );
    }
  };

  const buttomMobile = () => {
    if (isLoggedIn) {
      if (isAdmin) {
        return (
          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded text-center"
          >
            Dashboard Admin
          </NavLink>
        );
      }
      return (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              navigate("/profile");
              setMobileOpen(false);
            }}
            className="bg-gray-200 dark:bg-gray-700 text-center py-2 rounded hover:opacity-80"
          >
            Profil Saya
          </button>
          <button
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded text-center"
          >
            Logout
          </button>
        </div>
      );
    } else {
      return (
        <NavLink
          to="/login"
          onClick={() => setMobileOpen(false)}
          className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded text-center"
        >
          Masuk
        </NavLink>
      );
    }
  };

  return (
    <div className="w-full sticky top-0 bg-white dark:bg-black shadow z-50 font-poppins">
      <div className="w-full flex items-center justify-between px-6 lg:px-12 py-4">
        {/* ✅ Logo klik ke home */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo Desa" className="h-12 w-auto" />
          <div className="text-gray-800 dark:text-white text-base sm:text-lg font-bold leading-tight">
            Desa Babakan Asem
            <div className="text-xs font-normal text-gray-500 dark:text-gray-300">
              Kabupaten Sumedang
            </div>
          </div>
        </Link>

        {/* ✅ MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 dark:text-gray-200 font-medium relative">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            Beranda
          </NavLink>

          {/* Dropdown Tentang */}
          <div className="relative group">
            <span
              className={`cursor-pointer flex items-center gap-1 ${
                isTentangActive ? activeClass : "hover:text-[#B6F500]"
              }`}
            >
              Tentang ▾
            </span>
            <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gradient-to-b from-[#B6F500] to-white rounded shadow-md z-50">
              <NavLink
                to="/profil"
                className="block px-4 py-2 text-black hover:underline"
              >
                Profil Desa
              </NavLink>
              <NavLink
                to="/pemerintahan"
                className="block px-4 py-2 text-black hover:underline"
              >
                Pemerintahan
              </NavLink>
              <NavLink
                to="/potensi"
                className="block px-4 py-2 text-black hover:underline"
              >
                Potensi Desa
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/infografis"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            Infografis
          </NavLink>

          {/* Dropdown Informasi */}
          <div className="relative group">
            <span
              className={`cursor-pointer flex items-center gap-1 ${
                isInformasiActive ? activeClass : "hover:text-[#B6F500]"
              }`}
            >
              Informasi ▾
            </span>
            <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gradient-to-b from-[#B6F500] to-white rounded shadow-md z-50">
              <NavLink
                to="/administrasi"
                className="block px-4 py-2 text-black hover:underline"
              >
                Administrasi
              </NavLink>
              <NavLink
                to="/agenda"
                className="block px-4 py-2 text-black hover:underline"
              >
                Agenda
              </NavLink>
              <NavLink
                to="/berita"
                className="block px-4 py-2 text-black hover:underline"
              >
                Berita
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/kontak"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            Kontak Kami
          </NavLink>

          {/* ✅ Avatar/Dropdown atau tombol Masuk */}
          {button()}
        </div>

        {/* ✅ HAMBURGER BUTTON (mobile) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-2xl text-gray-800 dark:text-white"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* ✅ MENU MOBILE */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-gradient-to-b from-white to-[#f7f7f7] dark:from-black dark:to-gray-900 text-gray-800 dark:text-gray-200">
          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#B6F500]"
          >
            Beranda
          </NavLink>

          {/* Tentang */}
          <details className="group">
            <summary className={`${isTentangActive ? "text-[#B6F500]" : ""}`}>
              Tentang
            </summary>
            <div className="pl-4 mt-2 flex flex-col gap-2">
              <NavLink
                to="/profil"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                Profil Desa
              </NavLink>
              <NavLink
                to="/pemerintahan"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                Pemerintahan
              </NavLink>
              <NavLink
                to="/potensi"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                Potensi Desa
              </NavLink>
            </div>
          </details>

          <NavLink
            to="/infografis"
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#B6F500]"
          >
            Infografis
          </NavLink>

          {/* Informasi */}
          <details className="group">
            <summary className={`${isInformasiActive ? "text-[#B6F500]" : ""}`}>
              Informasi
            </summary>
            <div className="pl-4 mt-2 flex flex-col gap-2">
              <NavLink
                to="/administrasi"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                Administrasi
              </NavLink>
              <NavLink
                to="/agenda"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                Agenda
              </NavLink>
              <NavLink
                to="/berita"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                Berita
              </NavLink>
            </div>
          </details>

          <NavLink
            to="/kontak"
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#B6F500]"
          >
            Kontak Kami
          </NavLink>

          {/* ✅ Mobile User Menu */}
          {buttomMobile()}
        </div>
      )}
    </div>
  );
}
