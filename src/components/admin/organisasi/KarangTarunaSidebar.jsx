import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaNewspaper,
  FaCalendarAlt,
  FaEnvelope,
  FaUsers,
  FaSignOutAlt,
  FaArrowLeft,
  FaStore,
  FaImage,
  FaSitemap,
  FaClipboardList,
  FaUsersCog,
  FaChartPie,
  FaUserFriends,
  FaHandshake,
  FaGlobeAsia,
  FaPeopleCarry,
  FaStar,
  FaTasks,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../contexts/AuthContext";
import { alertConfirm, alertSuccess, alertError } from "../../../libs/alert";
import { UserApi } from "../../../libs/api/UserApi";

export default function KarangTarunaSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { setProfile } = useAuth();

  // - supaya sidebar mobile gak langsung hilang
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else setTimeout(() => setIsVisible(false), 300); // sesuai durasi animasi
  }, [isOpen]);

  const handleLogout = async () => {
    const confirm = await alertConfirm(t("adminSidebar.actions.logoutConfirm"));
    if (!confirm) return;
    const response = await UserApi.logout(i18n.language);
    if (!response.ok) {
      await alertError(t("adminSidebar.actions.logoutError"));
      return;
    }
    setProfile(null);
    await alertSuccess(t("adminSidebar.actions.logoutSuccess"));
    navigate("/login");
  };

  const menu = [
    {
      to: "/karang-taruna/admin",
      label: t("adminSidebar.menu.dashboard") || "Dashboard",
      icon: <FaTachometerAlt />,
    },
  ];

  const pengaturan = [
    {
      to: "profil",
      label: t("adminSidebar.settings.profile") || "Profil",
      icon: <FaUsers />,
    },
  ];

  const renderSidebarContent = () => (
    <>
      {/* LOGO + JUDUL */}
      <div className="flex items-center gap-3 px-4 py-5 border-b bg-gradient-to-r from-green-400 to-[#B6F500]">
        <div className="bg-white p-1 rounded-lg shadow-sm">
          <img src={logo} alt="Logo Desa" className="w-9 h-9 object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight text-base">
            {t("adminSidebar.title") || "Admin Panel Desa"}
          </h1>
          <p className="text-xs text-green-100">
            {t("karangTarunaSidebar.subtitle") || "Karang Taruna Panel"}
          </p>
        </div>
      </div>

      {/* MENU UTAMA */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold shadow-md"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-lime-50 hover:text-green-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* PENGATURAN */}
        <p className="text-xs text-gray-400 mt-5 mb-2 px-2 uppercase tracking-wide">
          {t("adminSidebar.settings.title") || "Pengaturan"}
        </p>
        {pengaturan.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold shadow-md"
                  : "hover:bg-gradient-to-r hover:from-green-50 hover:to-lime-50 text-gray-700 hover:text-green-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        <hr className="my-4" />

        {/* KEMBALI KE WEBSITE & KELUAR */}
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm transition-all duration-200"
        >
          <FaArrowLeft />{" "}
          {t("adminSidebar.actions.backToWebsite") || "Kembali ke Website"}
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-red-50 text-red-500 text-sm transition-all duration-200"
        >
          <FaSignOutAlt /> {t("adminSidebar.actions.logout") || "Keluar"}
        </button>
      </nav>
    </>
  );

  return (
    <>
      {/* CSS animasi langsung di 1 file */}
      <style>{`
        .sidebar-mobile {
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
        }
        .sidebar-mobile.open {
          transform: translateX(0);
        }
        .sidebar-mobile.close {
          transform: translateX(-100%);
        }
      `}</style>

      {/* - Sidebar versi desktop */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex-col border-r z-50">
        {renderSidebarContent()}
      </div>

      {/* - Sidebar versi mobile */}
      {isVisible && (
        <div
          className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col border-r z-50 md:hidden sidebar-mobile ${
            isOpen ? "open" : "close"
          }`}
        >
          {renderSidebarContent()}
        </div>
      )}
    </>
  );
}
