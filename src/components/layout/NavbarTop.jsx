import { useState } from "react";
import { useLocation, NavLink, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { alertConfirm, alertSuccess } from "../../libs/alert";

export default function NavbarTop() {
  const { t } = useTranslation();
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
    const confirm = await alertConfirm(t("navbarTop.logoutConfirm"));
    if (!confirm) return;

    setAdminStatus(false);
    logout();
    await alertSuccess(t("navbarTop.logoutSuccess"));
    setAvatarMenuOpen(false);
    navigate("/login");
  };

  const goProfile = () => {
    setAvatarMenuOpen(false);
    navigate("/profile");
  };

  const userMenu = () => {
    if (isAdmin) {
      return (
        <Link
          to="/admin"
          className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          {t("navbarTop.dashboardAdmin")}
        </Link>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => setAvatarMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 text-gray-700 hover:text-[#B6F500] transition"
        >
          <FaUserCircle size={28} />
        </button>
        {avatarMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md py-2 z-50">
            <button
              onClick={goProfile}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {t("navbarTop.profilSaya")}
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
            >
              {t("navbarTop.logout")}
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
          {t("navbarTop.masuk")}
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
            {t("navbarTop.dashboardAdmin")}
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
            className="bg-gray-200 text-center py-2 rounded hover:opacity-80"
          >
            {t("navbarTop.profilSaya")}
          </button>
          <button
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            className="bg-gradient-to-r from-green-400 to-[#B6F500] text-white px-4 py-2 rounded text-center"
          >
            {t("navbarTop.logout")}
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
          {t("navbarTop.masuk")}
        </NavLink>
      );
    }
  };

  return (
    <div className="w-full sticky top-0 bg-white shadow z-50 font-poppins">
      <div className="w-full flex items-center justify-between px-6 lg:px-12 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo Desa" className="h-12 w-auto" />
          <div className="text-gray-800 text-base sm:text-lg font-bold leading-tight">
            {t("navbarTop.desaName")}
            <div className="text-xs font-normal text-gray-500">
              {t("navbarTop.kabupaten")}
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium relative">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            {t("navbarTop.home")}
          </NavLink>

          <div className="relative group">
            <span
              className={`cursor-pointer flex items-center gap-1 ${
                isTentangActive ? activeClass : "hover:text-[#B6F500]"
              }`}
            >
              {t("navbarTop.tentang")} ▾
            </span>
            <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gradient-to-b from-[#9BEC00] to-[#D2FF72] rounded shadow-md z-50">
              <NavLink
                to="/profil"
                className="block px-4 py-2 text-black hover:underline"
              >
                {t("navbarTop.profil")}
              </NavLink>
              <NavLink
                to="/pemerintahan"
                className="block px-4 py-2 text-black hover:underline"
              >
                {t("navbarTop.pemerintahan")}
              </NavLink>
              <NavLink
                to="/potensi"
                className="block px-4 py-2 text-black hover:underline"
              >
                {t("navbarTop.potensi")}
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/infografis"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            {t("navbarTop.infografis")}
          </NavLink>

          <div className="relative group">
            <span
              className={`cursor-pointer flex items-center gap-1 ${
                isInformasiActive ? activeClass : "hover:text-[#B6F500]"
              }`}
            >
              {t("navbarTop.informasi")} ▾
            </span>
            <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gradient-to-b from-[#9BEC00] to-[#D2FF72] rounded shadow-md z-50">
              <NavLink
                to="/administrasi"
                className="block px-4 py-2 text-black hover:underline"
              >
                {t("navbarTop.administrasi")}
              </NavLink>
              <NavLink
                to="/agenda"
                className="block px-4 py-2 text-black hover:underline"
              >
                {t("navbarTop.agenda")}
              </NavLink>
              <NavLink
                to="/berita"
                className="block px-4 py-2 text-black hover:underline"
              >
                {t("navbarTop.berita")}
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/kontak"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            {t("navbarTop.kontak")}
          </NavLink>

          {button()}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-2xl text-gray-800"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-gradient-to-b from-white to-[#f7f7f7] text-gray-800">
          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#B6F500]"
          >
            {t("navbarTop.home")}
          </NavLink>

          <details className="group">
            <summary className={`${isTentangActive ? "text-[#B6F500]" : ""}`}>
              {t("navbarTop.tentang")}
            </summary>
            <div className="pl-4 mt-2 flex flex-col gap-2">
              <NavLink
                to="/profil"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                {t("navbarTop.profil")}
              </NavLink>
              <NavLink
                to="/pemerintahan"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                {t("navbarTop.pemerintahan")}
              </NavLink>
              <NavLink
                to="/potensi"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                {t("navbarTop.potensi")}
              </NavLink>
            </div>
          </details>

          <NavLink
            to="/infografis"
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#B6F500]"
          >
            {t("navbarTop.infografis")}
          </NavLink>

          <details className="group">
            <summary className={`${isInformasiActive ? "text-[#B6F500]" : ""}`}>
              {t("navbarTop.informasi")}
            </summary>
            <div className="pl-4 mt-2 flex flex-col gap-2">
              <NavLink
                to="/administrasi"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                {t("navbarTop.administrasi")}
              </NavLink>
              <NavLink
                to="/agenda"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                {t("navbarTop.agenda")}
              </NavLink>
              <NavLink
                to="/berita"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                {t("navbarTop.berita")}
              </NavLink>
            </div>
          </details>

          <NavLink
            to="/kontak"
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#B6F500]"
          >
            {t("navbarTop.kontak")}
          </NavLink>

          {buttomMobile()}
        </div>
      )}
    </div>
  );
}
